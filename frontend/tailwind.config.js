/** @type {import('tailwindcss').Config} */

// ============================================
// 🎨 메인 컬러 설정 - 이 값만 수정하세요!
// ============================================
const MAIN_COLOR = '#2E2622';
// ============================================

// 메인 컬러 기반 팔레트 자동 생성
function generatePalette(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const lighten = (factor) => {
    const nr = Math.round(r + (255 - r) * factor);
    const ng = Math.round(g + (255 - g) * factor);
    const nb = Math.round(b + (255 - b) * factor);
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  };

  const darken = (factor) => {
    const nr = Math.round(r * (1 - factor));
    const ng = Math.round(g * (1 - factor));
    const nb = Math.round(b * (1 - factor));
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  };

  return {
    50: lighten(0.95),
    100: lighten(0.85),
    200: lighten(0.7),
    300: lighten(0.5),
    400: lighten(0.3),
    500: lighten(0.1),
    600: hex,
    700: hex,
    800: darken(0.2),
    900: darken(0.4),
    950: darken(0.6),
  };
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 메인 컬러 (공개 페이지용) - 위의 MAIN_COLOR 값으로 자동 생성됨
        main: generatePalette(MAIN_COLOR),
        // 진한 남색 (관리자 페이지용)
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1929',
        },
        // 나무색 (따뜻한 우드 톤)
        wood: {
          50: '#faf6f3',
          100: '#f3ebe4',
          200: '#e6d5c7',
          300: '#d4b8a0',
          400: '#c19a78',
          500: '#a67c52',
          600: '#8b6544',
          700: '#6e5038',
          800: '#5a422f',
          900: '#4a3728',
          950: '#2d2118',
        },
        // 흰색 타일 (밝은 배경)
        tile: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#e8e8e8',
          400: '#d4d4d4',
        },
        // primary를 navy로 매핑 (기존 코드 호환)
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        }
      },
      backgroundImage: {
        'tile-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8e8e8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
