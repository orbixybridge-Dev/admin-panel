'use client';

import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorHandler from '@/components/ErrorHandler';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <ErrorBoundary resetKey={pathname}>
      <ErrorHandler>
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </ProtectedRoute>
      </ErrorHandler>
    </ErrorBoundary>
  );
}

