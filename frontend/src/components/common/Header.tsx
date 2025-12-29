import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-navy-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-wood-300">
            くるみ
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className="text-tile-200 hover:text-wood-300 transition">
              홈
            </Link>
            <Link to="/menu" className="text-tile-200 hover:text-wood-300 transition">
              메뉴
            </Link>
            <Link to="/reservation" className="text-tile-200 hover:text-wood-300 transition">
              예약
            </Link>
            <Link to="/notice" className="text-tile-200 hover:text-wood-300 transition">
              공지
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
