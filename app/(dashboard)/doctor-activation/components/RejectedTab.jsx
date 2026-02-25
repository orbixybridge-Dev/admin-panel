'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchRejectedApplications,
  acceptRejectedDoctor,
  setFilters,
  setPage,
} from '@/store/slices/rejectedApplicationsSlice';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Table from '@/components/Table';
import { CheckCircle, Eye, Search, ChevronLeft, ChevronRight, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RejectedTab() {
  const dispatch = useAppDispatch();
  const { 
    doctors = [], 
    loading = false, 
    error = null, 
    totalElements = 0, 
    totalPages = 0, 
    currentPage = 0, 
    pageSize = 10, 
    filters = { search: '' } 
  } = useAppSelector((state) => state.rejectedApplications || {});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const lastFetchRef = useRef({ page: null, size: null });
  const errorRetryCountRef = useRef(0);
  const lastErrorRef = useRef(null);

  // Fetch data - only when page/pageSize actually changes
  useEffect(() => {
    // Skip if already loading (prevents duplicate calls)
    if (loading) {
      return;
    }

    // Don't retry if there's an error (prevents infinite loops)
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
      dispatch(fetchRejectedApplications({ page: currentPage, size: pageSize }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  // Reset refs on unmount to prevent stale state
  useEffect(() => {
    return () => {
      lastFetchRef.current = { page: null, size: null };
      errorRetryCountRef.current = 0;
      lastErrorRef.current = null;
    };
  }, []);

  // Show error toast when error occurs (only once per error)
  useEffect(() => {
    if (error && typeof error === 'string' && lastErrorRef.current !== error) {
      lastErrorRef.current = error;
      toast.error(error);
    }
  }, [error]);

  // Filter doctors - search by name, email, or mobile number
  const filteredDoctors = useMemo(() => {
    if (!doctors || !Array.isArray(doctors)) {
      return [];
    }
    let filtered = [...doctors];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.name?.toLowerCase().includes(searchLower) ||
          doctor.email?.toLowerCase().includes(searchLower) ||
          doctor.mobileNumber?.toLowerCase().includes(searchLower) ||
          doctor.userMobileNumber?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [doctors, filters]);

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailsModalOpen(true);
  };

  const handleAcceptClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsAcceptDialogOpen(true);
  };

  const handleAccept = async () => {
    try {
      await dispatch(acceptRejectedDoctor(selectedDoctor.doctorId)).unwrap();
      toast.success('Doctor accepted successfully!');
      setIsAcceptDialogOpen(false);
      setSelectedDoctor(null);
      // Refetch only if not already loading
      if (!loading) {
        lastFetchRef.current = { page: null, size: null }; // Reset to force refetch
        dispatch(fetchRejectedApplications({ page: currentPage, size: pageSize }));
      }
    } catch (error) {
      toast.error(error || 'Failed to accept doctor');
    }
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
      accessor: (row) => row.mobileNumber || row.userMobileNumber || '-',
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
      header: 'Experience',
      accessor: (row) => row.experience || '-',
    },
    {
      header: 'Rejected At',
      accessor: (row) => formatDate(row.rejectedAt),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAcceptClick(row)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Accept"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or mobile number..."
              value={filters.search}
              onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rejected applications...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No rejected applications</p>
          <p className="text-gray-500 text-sm mt-2">All rejected applications have been reviewed</p>
        </div>
      ) : (
        <>
          <Table columns={columns} data={filteredDoctors} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-600">
                Showing {currentPage * pageSize + 1} to{' '}
                {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} applications
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
                <p className="text-gray-900 mt-1">{selectedDoctor.mobileNumber || selectedDoctor.userMobileNumber || '-'}</p>
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
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    Rejected
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Registration Date</label>
                <p className="text-gray-900 mt-1">{formatDate(selectedDoctor.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Rejected Date</label>
                <p className="text-gray-900 mt-1">{formatDate(selectedDoctor.rejectedAt)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Accept Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isAcceptDialogOpen}
        onClose={() => {
          setIsAcceptDialogOpen(false);
          setSelectedDoctor(null);
        }}
        onConfirm={handleAccept}
        title="Accept Doctor Application"
        message={`Are you sure you want to accept "${selectedDoctor?.name}"? An approval email will be sent to the doctor.`}
        confirmText="Accept"
        variant="warning"
      />
    </div>
  );
}
