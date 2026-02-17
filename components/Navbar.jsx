'use client';

import { useState } from 'react';
import { Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const notifications = useAppSelector((state) => state.notifications.notifications);
  const unreadCount = notifications.filter(n => n.status === 'Unread').length;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.push('/login');
    } catch (error) {
      // Even if API call fails, clear local storage and redirect
      router.push('/login');
    }
  };

  return (
    <nav className="bg-white soft-shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">HD</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            HeyDoctor
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Link href="/notifications" className="relative">
            <button className="p-2 rounded-lg hover:bg-primary-50 transition-colors relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-purple-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg soft-shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || user?.email || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@heydoctor.com'}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors">
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

