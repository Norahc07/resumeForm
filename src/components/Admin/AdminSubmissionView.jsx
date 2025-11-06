import { useState } from 'react';
import { updateSubmission, deleteSubmission } from '../../firebase/firestore';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../ConfirmModal';
import UploadResumeModal from './UploadResumeModal';

const AdminSubmissionView = ({ submission, onBack }) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(submission);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false });
  const [uploadModal, setUploadModal] = useState({ isOpen: false });

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateSubmission(submission.id, editedData);
    if (result.success) {
      showToast('Submission updated successfully', 'success');
      setIsEditing(false);
    } else {
      showToast(`Update failed: ${result.error}`, 'error');
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    const result = await deleteSubmission(submission.id);
    if (result.success) {
      showToast('Submission deleted successfully', 'success');
      onBack();
    } else {
      showToast(`Delete failed: ${result.error}`, 'error');
    }
  };


  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800 flex items-center font-semibold transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setUploadModal({ isOpen: true })}
                disabled={submission.status === 'completed'}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {submission.status === 'completed' ? '✓ Completed' : 'Upload & Send'}
              </button>
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true })}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedData(submission);
                    }}
                    className="px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 space-y-8">
          {/* Personal Information */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.fullName || ''}
                    onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{submission.fullName || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedData.email || ''}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{submission.email || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedData.phone || ''}
                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{submission.phone || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editedData.linkedin || ''}
                    onChange={(e) => setEditedData({ ...editedData, linkedin: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {submission.linkedin ? (
                      <a href={submission.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {submission.linkedin}
                      </a>
                    ) : 'N/A'}
                  </p>
                )}
              </div>
            </div>
            {submission.address && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                {isEditing ? (
                  <textarea
                    value={editedData.address || ''}
                    onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                    rows={2}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{submission.address}</p>
                )}
              </div>
            )}
          </section>

          {/* Summary */}
          {submission.summary && (
            <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Summary</h2>
              {isEditing ? (
                <textarea
                  value={editedData.summary || ''}
                  onChange={(e) => setEditedData({ ...editedData, summary: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{submission.summary}</p>
              )}
            </section>
          )}

          {/* Experience */}
          {submission.experiences && submission.experiences.length > 0 && (
            <section className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>
              <div className="space-y-5">
                {submission.experiences.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-5 bg-white rounded-r-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle} at {exp.company}</h3>
                    <p className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'N/A'}
                    </p>
                    {exp.description && (
                      <p className="mt-2 text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {submission.educations && submission.educations.length > 0 && (
            <section className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 border border-green-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
              <div className="space-y-5">
                {submission.educations.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-5 bg-white rounded-r-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.startDate && edu.endDate && (
                      <p className="text-sm text-gray-600">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    )}
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {submission.skills && submission.skills.length > 0 && (
            <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {submission.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Metadata */}
          <section className="pt-6 border-t-2 border-gray-200 bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Submitted</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(submission.createdAt)}</p>
              </div>
              {submission.updatedAt && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(submission.updatedAt)}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</p>
                <span className={`inline-flex mt-1 px-3 py-1 text-xs font-bold rounded-full ${
                  submission.status === 'completed' ? 'bg-green-100 text-green-800' :
                  submission.status === 'pending' || !submission.status ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {submission.status === 'completed' ? '✓ Completed' : 
                   submission.status === 'pending' || !submission.status ? '⏳ Pending' : 
                   submission.status}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={handleDelete}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <UploadResumeModal
        isOpen={uploadModal.isOpen}
        onClose={() => setUploadModal({ isOpen: false })}
        submission={submission}
        onSuccess={() => {
          setUploadModal({ isOpen: false });
          showToast('Resume image uploaded and sent successfully!', 'success');
        }}
      />
    </div>
  );
};

export default AdminSubmissionView;

