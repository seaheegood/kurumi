import { useEffect, useState } from 'react';
import { noticeApi } from '../../api/notice';
import { Notice } from '../../types';
import Loading from '../../components/common/Loading';

export default function NoticeManagePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });

  const loadNotices = () => {
    setLoading(true);
    noticeApi.getAll().then(setNotices).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await noticeApi.update(editingNotice.id, form);
      } else {
        await noticeApi.create(form);
      }
      resetForm();
      loadNotices();
    } catch {
      alert('저장에 실패했습니다.');
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setForm({ title: notice.title, content: notice.content });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await noticeApi.delete(id);
      loadNotices();
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingNotice(null);
    setForm({ title: '', content: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
        >
          + 공지 추가
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editingNotice ? '공지 수정' : '공지 추가'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">제목</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetForm}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">취소</button>
                <button type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Desktop Table */}
        <table className="w-full hidden md:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">제목</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">작성일</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {notices.map((notice) => (
              <tr key={notice.id}>
                <td className="py-3 px-4 font-medium">{notice.title}</td>
                <td className="py-3 px-4 text-gray-600">{formatDate(notice.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleEdit(notice)} className="text-primary-600 hover:underline mr-3">수정</button>
                  <button onClick={() => handleDelete(notice.id)} className="text-red-500 hover:underline">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {notices.map((notice) => (
            <div key={notice.id} className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium">{notice.title}</h3>
                <span className="text-xs text-gray-500">{formatDate(notice.createdAt)}</span>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => handleEdit(notice)} className="text-primary-600 text-sm">수정</button>
                <button onClick={() => handleDelete(notice.id)} className="text-red-500 text-sm">삭제</button>
              </div>
            </div>
          ))}
        </div>

        {notices.length === 0 && <p className="text-center text-gray-500 py-8">등록된 공지사항이 없습니다.</p>}
      </div>
    </div>
  );
}
