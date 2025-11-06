import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { subscribeToSubmissions, deleteSubmission } from '../firebase/firestore';
import { signOut } from '../firebase/auth';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import AdminSubmissionView from '../components/Admin/AdminSubmissionView';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, submissionId: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      const unsubscribe = subscribeToSubmissions((result) => {
        if (result.success) {
          setSubmissions(result.data);
        } else {
          showToast(`Error loading submissions: ${result.error}`, 'error');
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [isAdmin, showToast]);

  const handleDelete = async (submissionId) => {
    const result = await deleteSubmission(submissionId);
    if (result.success) {
      showToast('Submission deleted successfully', 'success');
    } else {
      showToast(`Delete failed: ${result.error}`, 'error');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    showToast('Logged out successfully', 'info');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (selectedSubmission) {
    return (
      <AdminSubmissionView
        submission={selectedSubmission}
        onBack={() => setSelectedSubmission(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage resume submissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No submissions yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {submission.fullName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          submission.status === 'processed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {submission.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, submissionId: submission.id })}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{submission.fullName || 'N/A'}</h3>
                      <p className="text-xs text-gray-500 mt-1">{submission.email || 'N/A'}</p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      submission.status === 'processed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {submission.status || 'pending'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{formatDate(submission.createdAt)}</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, submissionId: submission.id })}
                      className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, submissionId: null })}
        onConfirm={() => handleDelete(deleteModal.submissionId)}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default AdminDashboard;

