import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AdminLayout from './components/common/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import MenuPage from './pages/public/MenuPage';
import ReservationPage from './pages/public/ReservationPage';
import NoticePage from './pages/public/NoticePage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import MenuManagePage from './pages/admin/MenuManagePage';
import DailyMenuPage from './pages/admin/DailyMenuPage';
import ReservationManagePage from './pages/admin/ReservationManagePage';
import NoticeManagePage from './pages/admin/NoticeManagePage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/menu" element={<PublicLayout><MenuPage /></PublicLayout>} />
      <Route path="/reservation" element={<PublicLayout><ReservationPage /></PublicLayout>} />
      <Route path="/notice" element={<PublicLayout><NoticePage /></PublicLayout>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout><DashboardPage /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/menus"
        element={
          <PrivateRoute>
            <AdminLayout><MenuManagePage /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/daily-menu"
        element={
          <PrivateRoute>
            <AdminLayout><DailyMenuPage /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/reservations"
        element={
          <PrivateRoute>
            <AdminLayout><ReservationManagePage /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/notices"
        element={
          <PrivateRoute>
            <AdminLayout><NoticeManagePage /></AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
