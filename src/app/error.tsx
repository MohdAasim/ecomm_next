'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const searchParams = useSearchParams();
  const message =
    searchParams.get('message') || error.message || 'An unknown error occurred';

  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
          {message ? message : 'Something went wrong!'}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          An unexpected error has occurred. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition font-semibold"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition font-semibold flex items-center justify-center"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
