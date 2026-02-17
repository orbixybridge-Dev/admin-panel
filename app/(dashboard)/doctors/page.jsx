'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchVerifiedDoctors,
  setFilters,
  setPage,
} from '@/store/slices/verifiedDoctorsSlice';
import Modal from '@/components/Modal';
import Table from '@/components/Table';
import { Eye, Search, ChevronLeft, ChevronRight, User, Filter, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { clearError } from '@/store/slices/verifiedDoctorsSlice';

export default function DoctorsPage() {
  const dispatch = useAppDispatch();
  const { doctors, loading, error, totalElements, totalPages, currentPage, pageSize, filters } =
    useAppSelector((state) => state.verifiedDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const lastFetchRef = useRef({ page: null, size: null });
  const errorRetryCountRef = useRef(0);

  // Fetch data - only when page/pageSize actually changes
  useEffect(() => {
    // Skip if already loading (prevents duplicate calls)
    if (loading) {
      return;
    }

    // Don't retry if there's an error (prevents infinite loops)
    // Allow retry only if error retry count is less than 2
    if (error && errorRetryCountRef.current >= 2) {
      return;
    }

    // Check if we need to fetch (page or size changed, or first mount)
    const needsFetch = 
      lastFetchRef.current.page !== currentPage || 
      lastFetchRef.current.size !== pageSize;

    if (needsFetch) {
      lastFetchRef.current = { page: currentPage, size: pageSize };
      if (error) {
        errorRetryCountRef.current += 1;
      } else {
        errorRetryCountRef.current = 0;
      }
      dispatch(fetchVerifiedDoctors({ page: currentPage, size: pageSize }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]); // Only depend on page/pageSize, check loading inside

  // Reset error retry count when error is cleared
  useEffect(() => {
    if (!error) {
      errorRetryCountRef.current = 0;
    }
  }, [error]);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    let filtered = [...doctors];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.name?.toLowerCase().includes(searchLower) ||
          doctor.email?.toLowerCase().includes(searchLower) ||
          doctor.registrationNumber?.toLowerCase().includes(searchLower) ||
          doctor.mobileNumber?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((doctor) => doctor.status === filters.status);
    }

    return filtered;
  }, [doctors, filters]);

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-500';
      case 'BUSY':
        return 'bg-yellow-500';
      case 'OFFLINE':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'Online';
      case 'BUSY':
        return 'Busy';
      case 'OFFLINE':
        return 'Offline';
      default:
        return status || '-';
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'doctorId',
      className: 'w-20',
    },
    {
      header: 'Doctor',
      accessor: (row) => (
        <div className="flex items-center space-x-3">
          {row.profilePicture ? (
            <img
              src={row.profilePicture}
              alt={row.name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center ${
              row.profilePicture ? 'hidden' : ''
            }`}
          >
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Registration #',
      accessor: (row) => (
        <span className="font-mono text-sm">{row.registrationNumber || '-'}</span>
      ),
    },
    {
      header: 'Mobile',
      accessor: 'mobileNumber',
    },
    {
      header: 'Department',
      accessor: (row) => row.department || '-',
    },
    {
      header: 'Qualification',
      accessor: (row) => row.qualification || '-',
    },
    {
      header: 'Status',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(row.status)}`}></div>
          <span className="text-sm font-medium">{getStatusLabel(row.status)}</span>
        </div>
      ),
    },
    {
      header: 'Verified Date',
      accessor: (row) => formatDate(row.verifiedAt),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <button
          onClick={() => handleViewDetails(row)}
          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1">
            Manage all verified doctors ({totalElements} total)
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Error loading doctors</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                dispatch(clearError());
                errorRetryCountRef.current = 0;
                lastFetchRef.current = { page: null, size: null };
                dispatch(fetchVerifiedDoctors({ page: currentPage, size: pageSize }));
              }}
              className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => dispatch(clearError())}
              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl soft-shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, registration number, or mobile..."
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
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="BUSY">Busy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl soft-shadow-lg p-12 text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-xl soft-shadow-lg p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No verified doctors found</p>
          <p className="text-gray-500 text-sm mt-2">
            {filters.search || filters.status !== 'all'
              ? 'Try adjusting your filters'
              : 'No doctors have been verified yet'}
          </p>
        </div>
      ) : (
        <>
          <Table columns={columns} data={filteredDoctors} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl soft-shadow-lg p-4">
              <div className="text-sm text-gray-600">
                Showing {currentPage * pageSize + 1} to{' '}
                {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} doctors
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Doctor Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedDoctor(null);
        }}
        title="Doctor Details"
        size="lg"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center">
              {selectedDoctor.profilePicture ? (
                <img
                  src={selectedDoctor.profilePicture}
                  alt={selectedDoctor.name}
                  className="w-32 h-32 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center ${
                  selectedDoctor.profilePicture ? 'hidden' : ''
                }`}
              >
                <User className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {selectedDoctor.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.mobileNumber}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Registration Number</label>
                <p className="font-mono text-gray-900 mt-1">
                  {selectedDoctor.registrationNumber || '-'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Department</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.department || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Qualification</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.qualification || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Experience</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.experience || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Hospital Location</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.hospitalLocation || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900 mt-1">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(selectedDoctor.status)}`}
                    ></div>
                    <span className="font-medium">{getStatusLabel(selectedDoctor.status)}</span>
                  </div>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Verification Status</label>
                <p className="text-gray-900 mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedDoctor.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {selectedDoctor.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Active Status</label>
                <p className="text-gray-900 mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedDoctor.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {selectedDoctor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Registration Date</label>
                <p className="text-gray-900 mt-1">{formatDate(selectedDoctor.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Verified Date</label>
                <p className="text-gray-900 mt-1">{formatDate(selectedDoctor.verifiedAt)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

