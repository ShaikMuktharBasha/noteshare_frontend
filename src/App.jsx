import { Routes, Route, useLocation } from 'react-router-dom';
import LightRays from './components/LightRays.jsx';
import Sidebar from './components/Sidebar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotesPage from './pages/NotesPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NoteDetailPage from './pages/NoteDetailPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PersonalDocsPage from './pages/PersonalDocsPage.jsx';

const App = () => {
  const location = useLocation();
  const hideSidebar = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname) ||
    location.pathname.startsWith('/reset');

  return (
    <div className="relative min-h-screen bg-transparent text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen">
        <LightRays
          raysOrigin="top-center"
          raysColor="#38bdf8"
          raysSpeed={0.8}
          lightSpread={0.8}
          rayLength={2}
          followMouse
          mouseInfluence={0.15}
          noiseAmount={0.02}
          distortion={0.1}
          className="h-full w-full opacity-90"
        />
      </div>
      {!hideSidebar && <Sidebar />}
      <main className={`mx-auto w-full max-w-6xl px-4 py-10 ${!hideSidebar ? 'md:ml-64' : ''}`}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset/:token" element={<ResetPasswordPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:id" element={<NoteDetailPage />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-docs"
            element={
              <ProtectedRoute>
                <PersonalDocsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
