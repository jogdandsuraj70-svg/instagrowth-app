import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Verifying authentication session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Verifying administrator privileges...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 dark:bg-red-800/40 text-red-600 dark:text-red-400 rounded-full mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">403 - Access Forbidden</h2>
        <p className="text-red-600 dark:text-red-400 text-sm mb-6">
          Your account (<span className="font-semibold">{user?.email}</span>) does not possess Administrative privileges. This area is strictly restricted to authorized system administrators.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow transition"
        >
          Return to User Dashboard
        </a>
      </div>
    );
  }

  return children;
}
