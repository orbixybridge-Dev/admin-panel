'use client';

import { useState } from 'react';
import PendingTab from './components/PendingTab';
import RejectedTab from './components/RejectedTab';

export default function DoctorActivationPage() {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Applications</h1>
          <p className="text-gray-600 mt-1">
            Review and manage doctor registration applications
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rejected
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'pending' && <PendingTab />}
          {activeTab === 'rejected' && <RejectedTab />}
        </div>
      </div>
    </div>
  );
}
