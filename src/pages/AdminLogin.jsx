import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAdmin } from '../firebase/auth';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAdmin } = useAuth();

  // Redirect if already admin
  if (isAdmin) {
    navigate('/admin');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Convert username to email format for Firebase
    // Default admin username maps to admin@resumeform.local
    const email = username.includes('@') ? username : `${username}@resumeform.local`;

    const result = await signInAdmin(email, password);
    
    if (result.success) {
      // Wait a bit for auth state to update and admin status to be checked
      showToast('Login successful!', 'success');
      
      // Wait for admin status check to complete
      setTimeout(async () => {
        // Check admin status directly
        const { checkAdminStatus } = await import('../firebase/auth');
        const isAdminUser = await checkAdminStatus(result.user.uid);
        
        if (isAdminUser) {
          navigate('/admin');
        } else {
          showToast('Access denied: Admin privileges required', 'error');
          // Sign out if not admin
          const { signOut } = await import('../firebase/auth');
          await signOut();
        }
      }, 1000);
    } else {
      showToast(`Login failed: ${result.error}`, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

