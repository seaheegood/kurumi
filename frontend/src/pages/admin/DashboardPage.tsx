import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reservationApi } from '../../api/reservation';
import { menuApi } from '../../api/menu';
import { noticeApi } from '../../api/notice';
import { Reservation } from '../../types';

export default function DashboardPage() {
  const [todayReservations, setTodayReservations] = useState<Reservation[]>([]);
  const [menuCount, setMenuCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    reservationApi.getByDate(today).then(setTodayReservations).catch(() => {});
    menuApi.getAll().then((data) => setMenuCount(data.length)).catch(() => {});
    noticeApi.getAll().then((data) => setNoticeCount(data.length)).catch(() => {});
  }, []);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm mb-1">오늘 예약</h3>
          <p className="text-3xl font-bold text-primary-600">{todayReservations.length}건</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm mb-1">등록된 메뉴</h3>
          <p className="text-3xl font-bold text-gray-900">{menuCount}개</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm mb-1">공지사항</h3>
          <p className="text-3xl font-bold text-gray-900">{noticeCount}개</p>
        </div>
      </div>

      {/* Today's Reservations */}
      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">오늘의 예약</h2>
          <Link to="/admin/reservations" className="text-primary-600 text-sm hover:underline">
            전체 보기 →
          </Link>
        </div>
        {todayReservations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">오늘 예약이 없습니다.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">시간</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">예약자</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">연락처</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">인원</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {todayReservations.map((res) => (
                    <tr key={res.id}>
                      <td className="py-3 px-4 font-medium">{formatTime(res.reservationTime)}</td>
                      <td className="py-3 px-4">{res.name}</td>
                      <td className="py-3 px-4 text-gray-600">{res.phone}</td>
                      <td className="py-3 px-4">{res.people}명</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {todayReservations.map((res) => (
                <div key={res.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{formatTime(res.reservationTime)}</span>
                    <span className="text-gray-600">{res.people}명</span>
                  </div>
                  <p className="text-sm">{res.name} · {res.phone}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
