import { useEffect, useState } from 'react';
import { reservationApi } from '../../api/reservation';
import { Reservation } from '../../types';
import Loading from '../../components/common/Loading';

export default function ReservationManagePage() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = (selectedDate: string) => {
    setLoading(true);
    reservationApi
      .getByDate(selectedDate)
      .then(setReservations)
      .catch(() => setReservations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservations(date);
  }, [date]);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await reservationApi.delete(id);
      loadReservations(date);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">예약 관리</h1>

      <div className="mb-6 flex flex-wrap items-center gap-2 md:gap-4">
        <label className="text-sm font-medium">날짜:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        />
        <span className="text-gray-600 text-sm">총 {reservations.length}건</span>
      </div>

      {loading ? (
        <Loading />
      ) : reservations.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          해당 날짜에 예약이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Desktop Table */}
          <table className="w-full hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">시간</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">예약자</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">연락처</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">인원</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">요청사항</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td className="py-3 px-4 font-medium">{formatTime(res.reservationTime)}</td>
                  <td className="py-3 px-4">{res.name}</td>
                  <td className="py-3 px-4 text-gray-600">{res.phone}</td>
                  <td className="py-3 px-4">{res.people}명</td>
                  <td className="py-3 px-4 text-gray-600 text-sm max-w-xs truncate">
                    {res.note || '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(res.id)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {reservations.map((res) => (
              <div key={res.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-lg">{formatTime(res.reservationTime)}</span>
                    <span className="ml-2 text-gray-600">{res.people}명</span>
                  </div>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="text-red-500 text-sm"
                  >
                    삭제
                  </button>
                </div>
                <p className="font-medium">{res.name}</p>
                <p className="text-sm text-gray-600">{res.phone}</p>
                {res.note && (
                  <p className="text-sm text-gray-500 mt-1">{res.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
