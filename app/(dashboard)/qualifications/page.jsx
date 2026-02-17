'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllQualifications,
  createQualification,
  updateQualification,
  deleteQualification,
  setFilters,
} from '@/store/slices/qualificationsSlice';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Table from '@/components/Table';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QualificationsPage() {
  const dispatch = useAppDispatch();
  const { qualifications, loading, error, filters } = useAppSelector(
    (state) => state.qualifications
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
  });
  const hasFetchedRef = useRef(false);
  const errorRetryCountRef = useRef(0);

  useEffect(() => {
    // Don't fetch if already fetched or loading
    if (hasFetchedRef.current || loading) {
      return;
    }

    // Don't retry if there's an error (prevents infinite loops)
    if (error && errorRetryCountRef.current >= 2) {
      return;
    }

    // Only fetch if we don't have data
    if (qualifications.length === 0) {
      hasFetchedRef.current = true;
      if (error) {
        errorRetryCountRef.current += 1;
      } else {
        errorRetryCountRef.current = 0;
      }
      dispatch(fetchAllQualifications());
    }
  }, [dispatch, qualifications.length, loading, error]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error && typeof error === 'string') {
      toast.error(error);
    }
  }, [error]);

  // Filter qualifications
  const filteredQualifications = useMemo(() => {
    let filtered = [...qualifications];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((qual) =>
        qual.name?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [qualifications, filters]);

  const handleOpenModal = (qualification = null) => {
    if (qualification) {
      setSelectedQualification(qualification);
      setFormData({
        name: qualification.name || '',
      });
    } else {
      setSelectedQualification(null);
      setFormData({
        name: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQualification(null);
    setFormData({
      name: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedQualification) {
        await dispatch(
          updateQualification({
            qualificationId: selectedQualification.qualificationId,
            qualificationData: formData,
          })
        ).unwrap();
        toast.success('Qualification updated successfully!');
      } else {
        await dispatch(createQualification(formData)).unwrap();
        toast.success('Qualification created successfully!');
      }
      handleCloseModal();
      // Refetch only if not already loading
      if (!loading) {
        hasFetchedRef.current = false; // Reset to allow refetch
        dispatch(fetchAllQualifications());
      }
    } catch (error) {
      toast.error(error || 'Failed to save qualification');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteQualification(selectedQualification.qualificationId)).unwrap();
      toast.success('Qualification deleted successfully!');
      setIsDeleteDialogOpen(false);
      setSelectedQualification(null);
      // Refetch only if not already loading
      if (!loading) {
        hasFetchedRef.current = false; // Reset to allow refetch
        dispatch(fetchAllQualifications());
      }
    } catch (error) {
      toast.error(error || 'Failed to delete qualification');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'qualificationId',
      className: 'w-20',
    },
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Created Date',
      accessor: (row) => formatDate(row.createdAt),
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
              setSelectedQualification(row);
              setIsDeleteDialogOpen(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
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
          <h1 className="text-3xl font-bold text-gray-900">Qualifications</h1>
          <p className="text-gray-600 mt-1">Manage doctor qualifications</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Qualification</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl soft-shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl soft-shadow-lg p-12 text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading qualifications...</p>
        </div>
      ) : (
        <Table columns={columns} data={filteredQualifications} />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedQualification ? 'Edit Qualification' : 'Add New Qualification'}
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter qualification name (e.g., MBBS, MD, etc.)"
            />
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
              {selectedQualification ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedQualification(null);
        }}
        onConfirm={handleDelete}
        title="Delete Qualification"
        message={`Are you sure you want to delete "${selectedQualification?.name}"?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
