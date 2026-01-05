import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dailyMenuApi } from '../../api/menu';
import { DailyMenu } from '../../types';

export default function HomePage() {
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dailyMenuApi
      .getToday()
      .then(setDailyMenus)
      .catch(() => setDailyMenus([]))
      .finally(() => setLoading(false));
  }, []);

  // 현재 표시할 메뉴
  const currentMenu = dailyMenus.length > 0 ? dailyMenus[currentIndex] : null;

  // 이전/다음 메뉴
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? dailyMenus.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === dailyMenus.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wood-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section - 오늘의 메뉴 배경 */}
      <section
        className="relative flex-1 min-h-[50vh] md:min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: currentMenu?.imageUrl
            ? `url(${currentMenu.imageUrl})`
            : 'linear-gradient(135deg, #4a3728 0%, #5a422f 50%, #6e5038 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* 콘텐츠 - 흰색 글씨 */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-2xl md:text-3xl text-white/90 mb-3 md:mb-6 tracking-widest font-medium">
            くるみ
          </p>

          {currentMenu ? (
            <>
              <p className="text-sm md:text-base text-main-200 mb-2 md:mb-3 font-semibold tracking-wide uppercase">
                Today's Menu {dailyMenus.length > 1 && `(${currentIndex + 1}/${dailyMenus.length})`}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold mb-3 md:mb-6 text-white">
                {currentMenu.name}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-3 md:mb-6 leading-relaxed max-w-2xl mx-auto">
                {currentMenu.description}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-main-200 mb-6 md:mb-10">
                {currentMenu.price.toLocaleString()}원
              </p>

              {/* 메뉴 네비게이션 (2개 이상일 때) */}
              {dailyMenus.length > 1 && (
                <div className="flex items-center justify-center gap-4 mb-4 md:mb-8">
                  <button
                    onClick={goToPrev}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex gap-2">
                    {dailyMenus.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition ${
                          idx === currentIndex ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={goToNext}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-6 text-white">
                맛있는 음식과 함께하는 특별한 시간
              </h1>
              <p className="text-base md:text-xl text-white/70 mb-6 md:mb-10">
                오늘의 메뉴를 준비 중입니다
              </p>
            </>
          )}

          {/* 버튼 영역 */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/menu"
              className="bg-main-600 hover:bg-main-700 text-white px-8 py-3 rounded-lg font-medium transition shadow-lg"
            >
              메뉴 보기
            </Link>
          </div>
        </div>

        {/* 스크롤 인디케이터 - 데스크톱만 */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>
    </div>
  );
}
