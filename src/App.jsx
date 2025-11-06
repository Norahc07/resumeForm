import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/Toast';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

function App() {
  useEffect(() => {
    // Register service worker for PWA
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        // Show a notification that a new version is available
        if (confirm('New version available! Click OK to update.')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
