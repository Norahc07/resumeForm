import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '../../context/ToastContext';
import Modal from '../Modal';

const ShareLinkModal = ({ isOpen, onClose }) => {
  const appLink = 'https://resume-form-eight.vercel.app/';
  const { showToast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appLink);
      showToast('Link copied to clipboard!', 'success');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = appLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'resume-form-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      showToast('QR code downloaded!', 'success');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Resume Form"
      size="lg"
    >
      <div className="space-y-6">
        {/* App Link Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Resume Form App Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={appLink}
              readOnly
              className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleCopyLink}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Share this link with users to access the Resume Form application
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 border-2 border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">QR Code</h3>
            <p className="text-sm text-gray-600">
              Scan this QR code to quickly access the Resume Form
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-gray-100">
              <QRCodeSVG
                id="qr-code-svg"
                value={appLink}
                size={256}
                level="H"
                includeMargin={true}
                fgColor="#1e40af"
                bgColor="#ffffff"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={handleDownloadQR}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download QR Code</span>
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Share Options</h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Resume Form',
                    text: 'Fill out your professional resume form',
                    url: appLink,
                  });
                } else {
                  handleCopyLink();
                }
              }}
              className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareLinkModal;

