import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-main-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-main-100">
            くるみ
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className="text-main-200 hover:text-white transition">
              홈
            </Link>
            <Link to="/menu" className="text-main-200 hover:text-white transition">
              메뉴
            </Link>
            <Link to="/notice" className="text-main-200 hover:text-white transition">
              공지
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
