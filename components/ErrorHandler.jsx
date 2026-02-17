'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ErrorHandler({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Reset any error states when route changes
    // This prevents errors from persisting across page navigation
    const handleError = (event) => {
      event.preventDefault();
      console.error('Unhandled error:', event.error);
    };

    const handleRejection = (event) => {
      event.preventDefault();
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [pathname]);

  return children;
}
