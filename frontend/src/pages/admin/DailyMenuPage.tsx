import { useState, useEffect, useRef } from 'react';
import { dailyMenuApi, uploadApi } from '../../api/menu';
import { DailyMenu } from '../../types';

export default function DailyMenuPage() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
  });

  const loadMenus = async (selectedDate: string) => {
    setLoading(true);
    try {
      const data = await dailyMenuApi.getByDate(selectedDate);
      setMenus(data);
    } catch {
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus(date);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    loadMenus(newDate);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadApi.uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl }));
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dailyMenuApi.create({ ...form, price: parseInt(form.price) || 0, date });
      alert('추가되었습니다.');
      setForm({ name: '', price: '', description: '', imageUrl: '' });
      loadMenus(date);
    } catch {
      alert('추가에 실패했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await dailyMenuApi.delete(id);
      alert('삭제되었습니다.');
      loadMenus(date);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">오늘의 메뉴 관리</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 메뉴 추가 폼 */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">날짜 선택</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <h2 className="text-lg font-semibold mb-4">새 메뉴 추가</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">메뉴 이름</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="오늘의 추천 메뉴"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">가격</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">설명</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">이미지</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    {uploading ? '업로드 중...' : '사진 선택'}
                  </button>
                  {form.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      삭제
                    </button>
                  )}
                </div>
                {form.imageUrl && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                    <img src={form.imageUrl} alt="미리보기" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="또는 이미지 URL 직접 입력"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-navy-700 hover:bg-navy-800 text-white px-4 py-2 rounded-lg"
            >
              메뉴 추가
            </button>
          </form>
        </div>

        {/* 등록된 메뉴 목록 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            {date} 등록된 메뉴 ({menus.length}개)
          </h2>

          {loading ? (
            <p className="text-gray-500">로딩 중...</p>
          ) : menus.length === 0 ? (
            <p className="text-gray-500">등록된 메뉴가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{menu.name}</h3>
                    <p className="text-sm text-gray-600">{menu.description}</p>
                    <p className="text-wood-600 font-bold">
                      {menu.price.toLocaleString()}원
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(menu.id)}
                    className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
