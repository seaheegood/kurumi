import { useState } from 'react';
import { reservationApi } from '../../api/reservation';
import { ReservationForm } from '../../types';

export default function ReservationPage() {
  const [form, setForm] = useState<ReservationForm>({
    name: '',
    phone: '',
    people: 2,
    reservationTime: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'people' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await reservationApi.create(form);
      setSuccess(true);
      setForm({ name: '', phone: '', people: 2, reservationTime: '', note: '' });
    } catch {
      setError('예약에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 오늘 이후 날짜만 선택 가능하도록 min 설정
  const today = new Date().toISOString().slice(0, 16);

  if (success) {
    return (
      <div className="min-h-screen bg-tile-100 bg-tile-pattern flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-wood-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-wood-600">✓</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-navy-900">예약이 완료되었습니다!</h2>
          <p className="text-navy-600 mb-8">예약 확인을 위해 연락드리겠습니다.</p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-navy-800 hover:bg-navy-900 text-tile-50 px-6 py-3 rounded-lg transition font-medium"
          >
            새 예약하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tile-100 bg-tile-pattern py-12">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-navy-900">예약하기</h1>
        <p className="text-navy-600 text-center mb-8">
          방문 전 예약을 해주시면 더 좋은 서비스를 제공해드립니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-tile-50 p-8 rounded-xl shadow-md border border-tile-300">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">예약자 이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-tile-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-tile-50"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">연락처</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-tile-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-tile-50"
              placeholder="010-1234-5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">인원 수</label>
            <input
              type="number"
              name="people"
              value={form.people}
              onChange={handleChange}
              min="1"
              max="20"
              required
              className="w-full px-4 py-3 border border-tile-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-tile-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">예약 일시</label>
            <input
              type="datetime-local"
              name="reservationTime"
              value={form.reservationTime}
              onChange={handleChange}
              min={today}
              required
              className="w-full px-4 py-3 border border-tile-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-tile-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">요청사항 (선택)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-tile-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none bg-tile-50"
              placeholder="특별한 요청사항이 있으시면 적어주세요"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-wood-600 hover:bg-wood-700 disabled:bg-tile-400 text-tile-50 py-4 rounded-lg font-medium transition"
          >
            {loading ? '예약 중...' : '예약하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
