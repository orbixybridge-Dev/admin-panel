'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateStatusLocal } from '@/store/slices/doctorsSlice';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import { Eye, User, FileText } from 'lucide-react';

export default function DoctorsPage() {
  const dispatch = useAppDispatch();
  const doctors = useAppSelector((state) => state.doctors.doctors);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleStatusChange = (doctorId, newStatus) => {
    dispatch(updateStatusLocal({ doctorId, status: newStatus }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online':
        return 'bg-green-500';
      case 'Busy':
        return 'bg-yellow-500';
      case 'Offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const columns = [
    {
      header: 'Serial No',
      accessor: (row) => row.serialNo,
    },
    {
      header: 'Doctor Name',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-purple-400 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Mobile Number',
      accessor: (row) => row.mobile,
    },
    {
      header: 'Status',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(row.status)}`}></div>
          <span className="font-medium">{row.status}</span>
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className="ml-2 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
            <option value="Busy">Busy</option>
          </select>
        </div>
      ),
    },
    {
      header: 'Total Attended Calls',
      accessor: (row) => (
        <span className="font-semibold text-primary-600">{row.totalAttendedCalls}</span>
      ),
    },
    {
      header: 'Bill Generated',
      accessor: (row) => (
        <span className="font-semibold text-purple-600">{row.billGenerated}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <button
          onClick={() => handleView(row)}
          className="flex items-center space-x-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
        <p className="text-gray-600 mt-2">Manage all registered doctors</p>
      </div>

      <Table columns={columns} data={doctors} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDoctor(null);
        }}
        title="Doctor Details"
        size="lg"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            {/* Photo Placeholder */}
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-purple-400 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Doctor Name</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedDoctor.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Mobile</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.mobile}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedDoctor.status)}`}></div>
                  <p className="text-gray-900 font-medium">{selectedDoctor.status}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Total Attended Calls</label>
                <p className="text-gray-900 mt-1 font-semibold">{selectedDoctor.totalAttendedCalls}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Bill Generated</label>
                <p className="text-gray-900 mt-1 font-semibold">{selectedDoctor.billGenerated}</p>
              </div>
            </div>

            {/* Documents */}
            <div>
              <label className="text-sm font-medium text-gray-600">Documents</label>
              <div className="mt-2 space-y-2">
                {selectedDoctor.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attended Calls */}
            <div>
              <label className="text-sm font-medium text-gray-600">Recent Attended Calls</label>
              <div className="mt-2 space-y-2">
                {selectedDoctor.attendedCalls.map((call) => (
                  <div
                    key={call.id}
                    className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{call.patientName}</p>
                      <p className="text-sm text-gray-600">{call.date} • {call.duration}</p>
                    </div>
                    <p className="font-semibold text-primary-600">${call.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

