'use client';

import { useAppSelector } from '@/store/hooks';
import { Users, UserCheck, Stethoscope, CreditCard, Bell, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const doctorActivations = useAppSelector((state) => state.doctorActivation.doctors);
  const patients = useAppSelector((state) => state.patients.patients);
  const doctors = useAppSelector((state) => state.doctors.doctors);
  const payments = useAppSelector((state) => state.payments.payments);
  const notifications = useAppSelector((state) => state.notifications.notifications);

  const pendingDoctors = doctorActivations.filter(d => d.status === 'pending').length;
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;
  const unreadNotifications = notifications.filter(n => n.status === 'Unread').length;
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    {
      title: 'Pending Doctor Activations',
      value: pendingDoctors,
      icon: UserCheck,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      color: 'from-primary-400 to-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Active Doctors',
      value: totalDoctors,
      icon: Stethoscope,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Payments',
      value: pendingPayments,
      icon: CreditCard,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Unread Notifications',
      value: unreadNotifications,
      icon: Bell,
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to HeyDoctor Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl soft-shadow-lg p-6 hover:shadow-soft-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center ${stat.bgColor}`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl soft-shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Notifications</h2>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.status === 'Unread'
                    ? 'bg-primary-50 border-primary-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.type}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  {notification.status === 'Unread' && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl soft-shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/doctor-activation"
              className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <p className="font-medium text-gray-900">Review Doctor Activations</p>
              <p className="text-sm text-gray-600 mt-1">{pendingDoctors} pending requests</p>
            </a>
            <a
              href="/payments"
              className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <p className="font-medium text-gray-900">Process Payments</p>
              <p className="text-sm text-gray-600 mt-1">{pendingPayments} pending payments</p>
            </a>
            <a
              href="/notifications"
              className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <p className="font-medium text-gray-900">View All Notifications</p>
              <p className="text-sm text-gray-600 mt-1">{unreadNotifications} unread</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

