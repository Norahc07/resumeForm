import { useState } from 'react';
import { updateSubmission, deleteSubmission } from '../../firebase/firestore';
import { convertResumeToImageAndEmail } from '../../firebase/functions';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../ConfirmModal';
import Modal from '../Modal';

const AdminSubmissionView = ({ submission, onBack }) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(submission);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false });
  const [emailModal, setEmailModal] = useState({ isOpen: false, email: '' });
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleConvertAndEmail = async () => {
    if (!emailModal.email) {
      showToast('Please enter a recipient email', 'error');
      return;
    }

    setIsProcessing(true);
    const result = await convertResumeToImageAndEmail(submission.id, emailModal.email);
    setIsProcessing(false);
    setEmailModal({ isOpen: false, email: '' });

    if (result.success) {
      showToast('Resume converted and emailed successfully!', 'success');
    } else {
      showToast(`Failed to send email: ${result.error}`, 'error');
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setEmailModal({ isOpen: true, email: '' })}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Convert & Email
              </button>
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true })}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedData(submission);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Personal Information */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
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
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Summary</h2>
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
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
              <div className="space-y-4">
                {submission.experiences.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
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
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
              <div className="space-y-4">
                {submission.educations.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
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
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {submission.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Metadata */}
          <section className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <strong>Submitted:</strong> {formatDate(submission.createdAt)}
            </p>
            {submission.updatedAt && (
              <p className="text-sm text-gray-500">
                <strong>Last Updated:</strong> {formatDate(submission.updatedAt)}
              </p>
            )}
            <p className="text-sm text-gray-500">
              <strong>Status:</strong> {submission.status || 'pending'}
            </p>
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

      <Modal
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ isOpen: false, email: '' })}
        title="Convert Resume to Image and Email"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the recipient email address. The resume will be converted to an image and sent as an attachment.
          </p>
          <div>
            <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email *
            </label>
            <input
              type="email"
              id="recipientEmail"
              value={emailModal.email}
              onChange={(e) => setEmailModal({ ...emailModal, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="recipient@example.com"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setEmailModal({ isOpen: false, email: '' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConvertAndEmail}
              disabled={isProcessing || !emailModal.email}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Send Email'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSubmissionView;

