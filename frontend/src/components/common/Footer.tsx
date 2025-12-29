import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-tile-200 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-wood-300 mb-3">くるみ</h3>
            <p className="text-sm text-tile-300">맛있는 음식과 함께하는 특별한 시간</p>
          </div>
          <div>
            <h4 className="font-semibold text-wood-300 mb-3">영업시간</h4>
            <p className="text-sm">월-목 18:30 ~ 01:00 (L.O 23:40)</p>
            <p className="text-sm">금-토 18:30 ~ 02:00 (L.O 00:40)</p>
            <p className="text-sm text-wood-400">일요일 휴무</p>
          </div>
          <div>
            <h4 className="font-semibold text-wood-300 mb-3">연락처</h4>
            <p className="text-sm">0507-1316-8382</p>
            <p className="text-sm">경기 고양시 일산동구 고봉로 26-14 120호</p>
          </div>
        </div>
        <div className="border-t border-navy-700 mt-8 pt-6 flex justify-between items-center">
          <p className="text-sm text-tile-400">&copy; 2024 Kurumi. All rights reserved.</p>
          <Link to="/admin/login" className="text-sm text-tile-400 hover:text-wood-300">
            관리자
          </Link>
        </div>
      </div>
    </footer>
  );
}
