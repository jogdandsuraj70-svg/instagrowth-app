import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="bg-white dark:bg-gray-800 max-w-md w-full p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-full">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">404 - Page Not Found</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The requested URL path does not exist on this server.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md transition active-press"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home Flow</span>
        </Link>
      </div>
    </div>
  );
}
