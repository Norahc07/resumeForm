import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { subscribeToSubmissions, deleteSubmission, updateSubmission } from '../firebase/firestore';
import { signOut } from '../firebase/auth';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import AdminSubmissionView from '../components/Admin/AdminSubmissionView';
import UploadResumeModal from '../components/Admin/UploadResumeModal';
import ShareLinkModal from '../components/Admin/ShareLinkModal';
import logo from '../assets/resumeAppLogo.png';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, submissionId: null });
  const [uploadModal, setUploadModal] = useState({ isOpen: false, submission: null });
  const [shareModal, setShareModal] = useState({ isOpen: false });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src={logo} 
                alt="Resume Form Logo" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">Manage and process resume submissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShareModal({ isOpen: true })}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share App</span>
              </button>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
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
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No submissions yet</h3>
              <p className="mt-2 text-sm text-gray-500">Resume submissions will appear here once users submit their forms.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Stats Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">Total Submissions</p>
                  <p className="text-2xl font-bold">{submissions.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium opacity-90">Pending</p>
                  <p className="text-2xl font-bold">
                    {submissions.filter(s => s.status === 'pending' || !s.status).length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium opacity-90">Completed</p>
                  <p className="text-2xl font-bold">
                    {submissions.filter(s => s.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                            {(submission.fullName || 'N/A').charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{submission.fullName || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{submission.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(submission.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                          submission.status === 'completed' ? 'bg-green-100 text-green-800' :
                          submission.status === 'pending' || !submission.status ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {submission.status === 'completed' ? '✓ Completed' : 
                           submission.status === 'pending' || !submission.status ? '⏳ Pending' : 
                           submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md text-xs font-semibold"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setUploadModal({ isOpen: true, submission })}
                            disabled={submission.status === 'completed'}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                          >
                            Upload
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, submissionId: submission.id })}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </div>
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
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                      submission.status === 'completed' ? 'bg-green-100 text-green-800' :
                      submission.status === 'pending' || !submission.status ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {submission.status === 'completed' ? '✓ Completed' : 
                       submission.status === 'pending' || !submission.status ? '⏳ Pending' : 
                       submission.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{formatDate(submission.createdAt)}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="flex-1 px-3 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setUploadModal({ isOpen: true, submission })}
                      disabled={submission.status === 'completed'}
                      className="flex-1 px-3 py-2 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, submissionId: submission.id })}
                      className="flex-1 px-3 py-2 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm"
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

      <UploadResumeModal
        isOpen={uploadModal.isOpen}
        onClose={() => setUploadModal({ isOpen: false, submission: null })}
        submission={uploadModal.submission}
        onSuccess={() => {
          setUploadModal({ isOpen: false, submission: null });
          showToast('Resume image uploaded and sent successfully!', 'success');
        }}
      />

      <ShareLinkModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false })}
      />
    </div>
  );
};

export default AdminDashboard;

