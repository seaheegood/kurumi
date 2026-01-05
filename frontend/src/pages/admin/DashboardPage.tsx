import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuApi, dailyMenuApi } from '../../api/menu';
import { noticeApi } from '../../api/notice';
import { Menu, DailyMenu, Notice } from '../../types';

export default function DashboardPage() {
  const [menuCount, setMenuCount] = useState(0);
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [recentMenus, setRecentMenus] = useState<Menu[]>([]);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [noticeCount, setNoticeCount] = useState(0);

  useEffect(() => {
    menuApi.getAll().then((data) => {
      setMenuCount(data.length);
      setRecentMenus(data.slice(0, 5));
    }).catch(() => {});

    dailyMenuApi.getToday().then((data) => setDailyMenus(data)).catch(() => {});

    noticeApi.getAll().then((data) => {
      setNoticeCount(data.length);
      setRecentNotices(data.slice(0, 3));
    }).catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-gray-500">{today}</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/menus" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm mb-1">등록된 메뉴</h3>
          <p className="text-3xl font-bold text-primary-600">{menuCount}개</p>
        </Link>
        <Link to="/admin/daily-menu" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm mb-1">오늘의 메뉴</h3>
          <p className="text-3xl font-bold text-wood-600">{dailyMenus.length}개</p>
        </Link>
        <Link to="/admin/notices" className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm mb-1">공지사항</h3>
          <p className="text-3xl font-bold text-gray-700">{noticeCount}개</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 오늘의 메뉴 현황 */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">오늘의 메뉴 현황</h2>
            <Link to="/admin/daily-menu" className="text-sm text-primary-600 hover:underline">
              관리하기 →
            </Link>
          </div>
          {dailyMenus.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">등록된 오늘의 메뉴가 없습니다</p>
              <Link
                to="/admin/daily-menu"
                className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                메뉴 등록하기
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {dailyMenus.map((menu) => (
                <div key={menu.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {menu.imageUrl && (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{menu.name}</h3>
                    <p className="text-sm text-wood-600">{menu.price.toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 최근 공지사항 */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">최근 공지사항</h2>
            <Link to="/admin/notices" className="text-sm text-primary-600 hover:underline">
              전체보기 →
            </Link>
          </div>
          {recentNotices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">등록된 공지사항이 없습니다</p>
              <Link
                to="/admin/notices"
                className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                공지 작성하기
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotices.map((notice) => (
                <div key={notice.noticeId} className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium truncate">{notice.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{notice.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 일반 메뉴 현황 */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">등록된 메뉴 목록</h2>
            <Link to="/admin/menus" className="text-sm text-primary-600 hover:underline">
              전체보기 →
            </Link>
          </div>
          {recentMenus.length === 0 ? (
            <p className="text-gray-500 text-center py-4">등록된 메뉴가 없습니다</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {recentMenus.map((menu) => (
                <div key={menu.menuId} className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-400">{menu.category}</span>
                  <h3 className="font-medium truncate">{menu.name}</h3>
                  <p className="text-sm text-wood-600">{menu.price.toLocaleString()}원</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
