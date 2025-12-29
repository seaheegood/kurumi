import { useEffect, useState } from 'react';
import { menuApi } from '../../api/menu';
import { Menu } from '../../types';
import Loading from '../../components/common/Loading';

export default function MenuManagePage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    isAvailable: true,
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
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              name === 'price' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMenu) {
        await menuApi.update(editingMenu.menuId, form);
      } else {
        await menuApi.create(form);
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
      price: menu.price,
      category: menu.category || '',
      imageUrl: menu.imageUrl || '',
      isAvailable: menu.isAvailable,
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
    setForm({ name: '', description: '', price: 0, category: '', imageUrl: '', isAvailable: true });
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
                  <input type="text" name="category" value={form.category} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg" placeholder="안주, 주류 등" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">이미지 URL</label>
                <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isAvailable" checked={form.isAvailable}
                  onChange={(e) => setForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
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
        <table className="w-full">
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
                  <span className={`px-2 py-1 rounded text-xs ${menu.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {menu.isAvailable ? '판매중' : '품절'}
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
        {menus.length === 0 && <p className="text-center text-gray-500 py-8">등록된 메뉴가 없습니다.</p>}
      </div>
    </div>
  );
}
