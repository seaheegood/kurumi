import { useEffect, useState } from 'react';
import { noticeApi } from '../../api/notice';
import { Notice } from '../../types';
import Loading from '../../components/common/Loading';

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    noticeApi
      .getAll()
      .then(setNotices)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-tile-100 bg-tile-pattern py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-main-900">공지사항</h1>

        {notices.length === 0 ? (
          <p className="text-center text-main-500 py-12">등록된 공지사항이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-tile-50 rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg transition border border-tile-300"
                onClick={() => setSelectedNotice(selectedNotice?.id === notice.id ? null : notice)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-main-900">{notice.title}</h3>
                  <span className="text-sm text-main-500">{formatDate(notice.createdAt)}</span>
                </div>
                {selectedNotice?.id === notice.id && (
                  <div className="mt-4 pt-4 border-t border-tile-300">
                    <p className="text-main-700 whitespace-pre-wrap">{notice.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
