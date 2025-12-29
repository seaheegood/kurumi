/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 진한 남색 (메인 컬러)
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
