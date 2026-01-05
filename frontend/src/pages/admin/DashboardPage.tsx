import { useEffect, useState } from 'react';
import { menuApi, dailyMenuApi } from '../../api/menu';
import { noticeApi } from '../../api/notice';

export default function DashboardPage() {
  const [menuCount, setMenuCount] = useState(0);
  const [dailyMenuCount, setDailyMenuCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);

  useEffect(() => {
    menuApi.getAll().then((data) => setMenuCount(data.length)).catch(() => {});
    dailyMenuApi.getToday().then((data) => setDailyMenuCount(data.length)).catch(() => {});
    noticeApi.getAll().then((data) => setNoticeCount(data.length)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm mb-1">등록된 메뉴</h3>
          <p className="text-3xl font-bold text-primary-600">{menuCount}개</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm mb-1">오늘의 메뉴</h3>
          <p className="text-3xl font-bold text-gray-900">{dailyMenuCount}개</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm mb-1">공지사항</h3>
          <p className="text-3xl font-bold text-gray-900">{noticeCount}개</p>
        </div>
      </div>

    </div>
  );
}
