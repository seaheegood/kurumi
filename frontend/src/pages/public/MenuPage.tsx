import { useEffect, useState } from 'react';
import { menuApi, dailyMenuApi } from '../../api/menu';
import { Menu, DailyMenu } from '../../types';
import Loading from '../../components/common/Loading';

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('전체');

  useEffect(() => {
    Promise.all([menuApi.getAll(), dailyMenuApi.getToday()])
      .then(([menuData, dailyData]) => {
        setMenus(menuData);
        setDailyMenus(dailyData);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['전체', ...new Set(menus.map((m) => m.category).filter(Boolean))];
  const filteredMenus =
    activeCategory === '전체' ? menus : menus.filter((m) => m.category === activeCategory);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-tile-100 bg-tile-pattern">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-main-900">메뉴</h1>

        {/* Daily Menus - 오늘의 메뉴 전체 표시 */}
        {dailyMenus.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-main-800 mb-4 flex items-center gap-2">
              <span className="bg-main-600 text-white px-3 py-1 rounded-full text-sm">
                Today's Menu
              </span>
              오늘의 메뉴
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {dailyMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="bg-gradient-to-r from-main-700 to-main-800 text-white rounded-xl p-6 shadow-lg"
                >
                  <h3 className="text-2xl font-bold mb-2">{menu.name}</h3>
                  <p className="text-main-200 mb-3">{menu.description}</p>
                  <p className="text-2xl font-bold text-main-100">
                    {menu.price.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition font-medium ${
                activeCategory === cat
                  ? 'bg-main-700 text-tile-50'
                  : 'bg-tile-50 text-main-700 hover:bg-main-100 border border-tile-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map((menu) => (
            <div
              key={menu.menuId}
              className={`bg-tile-50 rounded-xl shadow-md overflow-hidden border border-tile-300 ${
                !menu.available ? 'opacity-50' : ''
              }`}
            >
              {menu.imageUrl && (
                <img src={menu.imageUrl} alt={menu.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-main-900">{menu.name}</h3>
                  {!menu.available && (
                    <span className="bg-tile-300 text-main-600 text-xs px-2 py-1 rounded">
                      품절
                    </span>
                  )}
                </div>
                {menu.description && (
                  <p className="text-main-600 text-sm mb-3">{menu.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-main-700 font-bold text-lg">
                    {menu.price.toLocaleString()}원
                  </span>
                  {menu.category && (
                    <span className="text-xs bg-main-100 text-main-700 px-2 py-1 rounded">
                      {menu.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMenus.length === 0 && (
          <p className="text-center text-main-500 py-12">등록된 메뉴가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
