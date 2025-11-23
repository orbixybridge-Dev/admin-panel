'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { approveDoctorLocal, rejectDoctorLocal } from '@/store/slices/doctorActivationSlice';
import Table from '@/components/Table';
import Drawer from '@/components/Drawer';
import { CheckCircle, XCircle, FileText, User } from 'lucide-react';

export default function DoctorActivationPage() {
  const dispatch = useAppDispatch();
  const doctors = useAppSelector((state) => state.doctorActivation.doctors);
  const pendingDoctors = doctors.filter(d => d.status === 'pending');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleApproveClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDrawerOpen(true);
  };

  const handleApprove = () => {
    if (selectedDoctor) {
      dispatch(approveDoctorLocal(selectedDoctor.id));
      setIsDrawerOpen(false);
      setSelectedDoctor(null);
    }
  };

  const handleReject = () => {
    if (selectedDoctor) {
      dispatch(rejectDoctorLocal(selectedDoctor.id));
      setIsDrawerOpen(false);
      setSelectedDoctor(null);
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
      header: 'Registration Number',
      accessor: (row) => (
        <span className="font-mono text-sm">{row.registrationNumber}</span>
      ),
    },
    {
      header: 'Documents',
      accessor: (row) => (
        <button className="flex items-center space-x-1 text-primary-600 hover:text-primary-700">
          <FileText className="w-4 h-4" />
          <span>{row.documents.length} files</span>
        </button>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <button
          onClick={() => handleApproveClick(row)}
          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-md transition-all font-medium"
        >
          Approve Doctor
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctor Activation Requests</h1>
        <p className="text-gray-600 mt-2">Review and approve doctor registration requests</p>
      </div>

      <Table columns={columns} data={pendingDoctors} />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDoctor(null);
        }}
        title="Doctor Details"
        width="w-[500px]"
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
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedDoctor.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.mobile}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900 mt-1">{selectedDoctor.gender}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Registration Number</label>
                <p className="font-mono text-gray-900 mt-1">{selectedDoctor.registrationNumber}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Documents</label>
                <div className="mt-2 space-y-2">
                  {selectedDoctor.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Approve</span>
              </button>
              <button
                onClick={handleReject}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-md transition-all font-medium"
              >
                <XCircle className="w-5 h-5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

