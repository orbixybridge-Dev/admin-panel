'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { markAsReadLocal, markAllAsRead } from '@/store/slices/notificationsSlice';
import Table from '@/components/Table';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.notifications);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsReadLocal(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const getTypeColor = (type) => {
    const colors = {
      'Payment Request': 'bg-blue-100 text-blue-800',
      'Doctor Activation': 'bg-purple-100 text-purple-800',
      'Patient Registration': 'bg-green-100 text-green-800',
      'System': 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors['System'];
  };

  const columns = [
    {
      header: 'Notification ID',
      accessor: (row) => (
        <span className="font-mono text-sm">{row.notificationId}</span>
      ),
    },
    {
      header: 'Type',
      accessor: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(row.type)}`}>
          {row.type}
        </span>
      ),
    },
    {
      header: 'Message',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          {row.status === 'Unread' && (
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
          )}
          <span className={row.status === 'Unread' ? 'font-medium text-gray-900' : 'text-gray-700'}>
            {row.message}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.status === 'Unread' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Time',
      accessor: (row) => row.time,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        row.status === 'Unread' ? (
          <button
            onClick={() => handleMarkAsRead(row.id)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Read</span>
          </button>
        ) : (
          <span className="text-sm text-gray-500">Read</span>
        )
      ),
    },
  ];

  const unreadCount = notifications.filter(n => n.status === 'Unread').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Manage all system notifications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:shadow-md transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl soft-shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-400 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Unread Notifications</p>
            <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
          </div>
        </div>
      </div>

      <Table columns={columns} data={notifications} />
    </div>
  );
}

