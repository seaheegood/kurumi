import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: '대시보드', icon: '📊' },
    { path: '/admin/menus', label: '메뉴 관리', icon: '🍽️' },
    { path: '/admin/daily-menu', label: '오늘의 메뉴', icon: '⭐' },
    { path: '/admin/reservations', label: '예약 관리', icon: '📅' },
    { path: '/admin/notices', label: '공지사항', icon: '📢' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-primary-400">
            Kurumi
          </Link>
          <p className="text-gray-400 text-sm mt-1">관리자</p>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="w-full text-left text-gray-400 hover:text-white transition"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
