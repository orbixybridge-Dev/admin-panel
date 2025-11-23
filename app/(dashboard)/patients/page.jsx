'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updatePatientLocal } from '@/store/slices/patientsSlice';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import { Eye, Edit, User, FileText } from 'lucide-react';

export default function PatientsPage() {
  const dispatch = useAppDispatch();
  const patients = useAppSelector((state) => state.patients.patients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setEditForm(patient);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (selectedPatient && editForm) {
      dispatch(updatePatientLocal({ ...selectedPatient, ...editForm }));
      setIsEditMode(false);
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'Serial No',
      accessor: (row) => row.serialNo,
    },
    {
      header: 'Patient Name',
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
      header: 'Email',
      accessor: (row) => row.email,
    },
    {
      header: 'Gender',
      accessor: (row) => row.gender,
    },
    {
      header: 'Total Attended Calls',
      accessor: (row) => (
        <span className="font-semibold text-primary-600">{row.totalAttendedCalls}</span>
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
          <span>View / Edit</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-600 mt-2">Manage all registered patients</p>
      </div>

      <Table columns={columns} data={patients} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedPatient(null);
        }}
        title={isEditMode ? 'Edit Patient Details' : 'Patient Details'}
        size="lg"
      >
        {selectedPatient && (
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
                <label className="text-sm font-medium text-gray-600">Patient Name</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                {isEditMode ? (
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 mt-1">{selectedPatient.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                {isEditMode ? (
                  <input
                    type="tel"
                    value={editForm.mobile || ''}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 mt-1">{selectedPatient.mobile}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                {isEditMode ? (
                  <select
                    value={editForm.gender || ''}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900 mt-1">{selectedPatient.gender}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                {isEditMode ? (
                  <input
                    type="date"
                    value={editForm.dob || ''}
                    onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 mt-1">{selectedPatient.dob}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Total Attended Calls</label>
                <p className="text-gray-900 mt-1 font-semibold">{selectedPatient.totalAttendedCalls}</p>
              </div>
            </div>

            {/* Documents */}
            <div>
              <label className="text-sm font-medium text-gray-600">Documents</label>
              <div className="mt-2 space-y-2">
                {selectedPatient.documents.map((doc, index) => (
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

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              {isEditMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-md transition-all font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setEditForm(selectedPatient);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Details</span>
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

