'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllDepartments,
  createDepartment,
  updateDepartment,
  toggleDepartmentStatus,
  deleteDepartment,
  setFilters,
} from '@/store/slices/departmentsSlice';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Table from '@/components/Table';
import { Plus, Edit, Trash2, Power, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DepartmentsPage() {
  const dispatch = useAppDispatch();
  const { departments = [], loading = false, error = null, filters = { search: '', status: 'all' } } = useAppSelector((state) => state.departments || {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const hasFetchedRef = useRef(false);
  const errorRetryCountRef = useRef(0);
  const lastErrorRef = useRef(null);

  useEffect(() => {
    // Reset refs when component mounts (fresh page load)
    hasFetchedRef.current = false;
    errorRetryCountRef.current = 0;
    lastErrorRef.current = null;

    // Don't fetch if already loading
    if (loading) {
      return;
    }

    // Don't retry if there's an error (prevents infinite loops)
    if (error && errorRetryCountRef.current >= 2) {
      return;
    }

    // Only fetch if we don't have data
    if (!departments || departments.length === 0) {
      hasFetchedRef.current = true;
      if (error) {
        errorRetryCountRef.current += 1;
      } else {
        errorRetryCountRef.current = 0;
      }
      dispatch(fetchAllDepartments());
    }
  }, [dispatch]); // Only run on mount

  // Show error toast when error occurs (only once per error)
  useEffect(() => {
    if (error && typeof error === 'string' && lastErrorRef.current !== error) {
      lastErrorRef.current = error;
      toast.error(error);
    }
  }, [error]);

  // Filter departments
  const filteredDepartments = useMemo(() => {
    if (!departments || !Array.isArray(departments)) {
      return [];
    }
    let filtered = [...departments];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (dept) =>
          dept.name?.toLowerCase().includes(searchLower) ||
          dept.description?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((dept) =>
        filters.status === 'active' ? dept.isActive : !dept.isActive
      );
    }

    return filtered;
  }, [departments, filters]);

  const handleOpenModal = (department = null) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData({
        name: department.name || '',
        description: department.description || '',
        isActive: department.isActive ?? true,
      });
    } else {
      setSelectedDepartment(null);
      setFormData({
        name: '',
        description: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
    setFormData({
      name: '',
      description: '',
      isActive: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDepartment) {
        await dispatch(
          updateDepartment({
            departmentId: selectedDepartment.departmentId,
            departmentData: formData,
          })
        ).unwrap();
        toast.success('Department updated successfully!');
      } else {
        await dispatch(createDepartment(formData)).unwrap();
        toast.success('Department created successfully!');
      }
      handleCloseModal();
      // Refetch only if not already loading
      if (!loading) {
        hasFetchedRef.current = false; // Reset to allow refetch
        dispatch(fetchAllDepartments());
      }
    } catch (error) {
      toast.error(error || 'Failed to save department');
    }
  };

  const handleToggleStatus = async () => {
    try {
      await dispatch(toggleDepartmentStatus(selectedDepartment.departmentId)).unwrap();
      toast.success(
        `Department ${selectedDepartment.isActive ? 'deactivated' : 'activated'} successfully!`
      );
      setIsToggleDialogOpen(false);
      setSelectedDepartment(null);
      // Refetch only if not already loading
      if (!loading) {
        hasFetchedRef.current = false; // Reset to allow refetch
        dispatch(fetchAllDepartments());
      }
    } catch (error) {
      toast.error(error || 'Failed to toggle department status');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteDepartment(selectedDepartment.departmentId)).unwrap();
      toast.success('Department deleted successfully!');
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
      // Refetch only if not already loading
      if (!loading) {
        hasFetchedRef.current = false; // Reset to allow refetch
        dispatch(fetchAllDepartments());
      }
    } catch (error) {
      toast.error(error || 'Failed to delete department');
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'departmentId',
      className: 'w-20',
    },
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Description',
      accessor: (row) => (
        <div className="max-w-md">
          <p className="truncate" title={row.description}>
            {row.description || '-'}
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Available Doctors',
      accessor: (row) => row.availableDoctors || 0,
      className: 'text-center',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedDepartment(row);
              setIsToggleDialogOpen(true);
            }}
            className={`p-2 rounded-lg transition-colors ${
              row.isActive
                ? 'text-yellow-600 hover:bg-yellow-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={row.isActive ? 'Deactivate' : 'Activate'}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedDepartment(row);
              setIsDeleteDialogOpen(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
            disabled={row.availableDoctors > 0}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage departments and their settings</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl soft-shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={filters.search}
              onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl soft-shadow-lg p-12 text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading departments...</p>
        </div>
      ) : (
        <Table columns={columns} data={filteredDepartments} />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedDepartment ? 'Edit Department' : 'Add New Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              maxLength={100}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter department name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              maxLength={500}
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter department description"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg hover:shadow-lg transition-all"
            >
              {selectedDepartment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleDelete}
        title="Delete Department"
        message={
          selectedDepartment?.availableDoctors > 0
            ? `Cannot delete department "${selectedDepartment?.name}" because it has ${selectedDepartment?.availableDoctors} associated doctor(s).`
            : `Are you sure you want to delete "${selectedDepartment?.name}"? This action cannot be undone.`
        }
        confirmText="Delete"
        variant="danger"
      />

      {/* Toggle Status Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isToggleDialogOpen}
        onClose={() => {
          setIsToggleDialogOpen(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleToggleStatus}
        title={selectedDepartment?.isActive ? 'Deactivate Department' : 'Activate Department'}
        message={`Are you sure you want to ${
          selectedDepartment?.isActive ? 'deactivate' : 'activate'
        } "${selectedDepartment?.name}"?`}
        confirmText={selectedDepartment?.isActive ? 'Deactivate' : 'Activate'}
        variant="warning"
      />
    </div>
  );
}
