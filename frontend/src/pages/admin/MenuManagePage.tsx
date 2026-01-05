import { useEffect, useState, useRef } from 'react';
import { menuApi, uploadApi } from '../../api/menu';
import { Menu } from '../../types';
import Loading from '../../components/common/Loading';

export default function MenuManagePage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    available: true,
  });

  const loadMenus = () => {
    setLoading(true);
    menuApi.getAll().then(setMenus).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
    const submitData = {
      ...form,
      price: parseInt(form.price) || 0,
    };
    try {
      if (editingMenu) {
        await menuApi.update(editingMenu.menuId, submitData);
      } else {
        await menuApi.create(submitData);
      }
      resetForm();
      loadMenus();
    } catch (err) {
      alert('저장에 실패했습니다.');
    }
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setForm({
      name: menu.name,
      description: menu.description || '',
      price: String(menu.price),
      category: menu.category || '',
      imageUrl: menu.imageUrl || '',
      available: menu.available,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await menuApi.delete(id);
      loadMenus();
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMenu(null);
    setForm({ name: '', description: '', price: '', category: '', imageUrl: '', available: true });
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">메뉴 관리</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
        >
          + 메뉴 추가
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingMenu ? '메뉴 수정' : '메뉴 추가'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">이름</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">가격</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} required
                    className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">카테고리</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg" required>
                    <option value="">선택하세요</option>
                    <option value="안주">안주</option>
                    <option value="주류">주류</option>
                    <option value="음료">음료</option>
                  </select>
                </div>
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
              <div className="flex items-center gap-2">
                <input type="checkbox" name="available" checked={form.available}
                  onChange={(e) => setForm(prev => ({ ...prev, available: e.target.checked }))}
                  className="w-4 h-4" />
                <label className="text-sm">판매 가능</label>
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

      {/* Menu List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Desktop Table */}
        <table className="w-full hidden md:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">이름</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">카테고리</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">가격</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">상태</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {menus.map((menu) => (
              <tr key={menu.menuId}>
                <td className="py-3 px-4 font-medium">{menu.name}</td>
                <td className="py-3 px-4 text-gray-600">{menu.category || '-'}</td>
                <td className="py-3 px-4">{menu.price.toLocaleString()}원</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${menu.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {menu.available ? '판매중' : '품절'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleEdit(menu)} className="text-primary-600 hover:underline mr-3">수정</button>
                  <button onClick={() => handleDelete(menu.menuId)} className="text-red-500 hover:underline">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {menus.map((menu) => (
            <div key={menu.menuId} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{menu.name}</h3>
                  <p className="text-sm text-gray-500">{menu.category || '-'}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${menu.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {menu.available ? '판매중' : '품절'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{menu.price.toLocaleString()}원</span>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(menu)} className="text-primary-600 text-sm">수정</button>
                  <button onClick={() => handleDelete(menu.menuId)} className="text-red-500 text-sm">삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {menus.length === 0 && <p className="text-center text-gray-500 py-8">등록된 메뉴가 없습니다.</p>}
      </div>
    </div>
  );
}
