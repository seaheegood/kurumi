import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-main-700 text-main-100 py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Mobile Footer - 간결하게 */}
        <div className="md:hidden">
          <div className="flex justify-between items-center text-sm mb-3">
            <div>
              <p>월-목 18:30 ~ 01:00</p>
              <p>금-토 18:30 ~ 02:00</p>
              <p className="text-main-300">일요일 휴무</p>
            </div>
            <a
              href="tel:0507-1316-8382"
              className="bg-main-600 hover:bg-main-500 text-white px-4 py-2 rounded-lg font-medium"
            >
              전화하기
            </a>
          </div>
          <div className="border-t border-main-600 pt-3 flex justify-between items-center">
            <p className="text-xs text-main-300">&copy; 2024 Kurumi</p>
            <Link to="/admin/login" className="text-xs text-main-300 hover:text-white">
              관리자
            </Link>
          </div>
        </div>

        {/* Desktop Footer - 기존 레이아웃 */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">くるみ</h3>
              <p className="text-sm text-main-200">맛있는 음식과 함께하는 특별한 시간</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">영업시간</h4>
              <p className="text-sm">월-목 18:30 ~ 01:00 (L.O 23:40)</p>
              <p className="text-sm">금-토 18:30 ~ 02:00 (L.O 00:40)</p>
              <p className="text-sm text-main-300">일요일 휴무</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">연락처</h4>
              <a href="tel:0507-1316-8382" className="text-sm hover:text-white">0507-1316-8382</a>
              <p className="text-sm">경기 고양시 일산동구 고봉로 26-14 120호</p>
            </div>
          </div>
          <div className="border-t border-main-600 mt-8 pt-6 flex justify-between items-center">
            <p className="text-sm text-main-300">&copy; 2024 Kurumi. All rights reserved.</p>
            <Link to="/admin/login" className="text-sm text-main-300 hover:text-white">
              관리자
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
