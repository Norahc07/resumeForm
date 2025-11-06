import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    // Give time for admin status to be checked after login
    if (!loading && user) {
      const timer = setTimeout(() => {
        setCheckingAdmin(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (!loading && !user) {
      setCheckingAdmin(false);
    }
  }, [loading, user, isAdmin]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

