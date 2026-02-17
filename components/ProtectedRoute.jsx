'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { checkAuth, validateAuth } from '@/store/slices/authSlice';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [validating, setValidating] = useState(true);
  const hasValidatedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    
    // Only validate once per session
    if (hasValidatedRef.current) {
      setValidating(false);
      return;
    }
    
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      // Validate token with server (only once)
      hasValidatedRef.current = true;
      dispatch(validateAuth())
        .then(() => {
          setValidating(false);
        })
        .catch(() => {
          // Silently handle any errors
          setValidating(false);
        });
    } else {
      hasValidatedRef.current = true;
      try {
        dispatch(checkAuth());
      } catch (error) {
        // Silently handle errors
      }
      setValidating(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (mounted && !validating && !loading && !isAuthenticated) {
      try {
        router.push('/login');
      } catch (error) {
        // Silently handle navigation errors
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
  }, [isAuthenticated, loading, mounted, validating, router]);

  if (!mounted || loading || validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
