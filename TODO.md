# Kurumi 프로젝트 배포 TODO

## 개요
- **목표**: Spring Boot 백엔드 + React 프론트엔드를 iwinv 서버에 통합 배포
- **배포 방식**: Spring Boot가 React 빌드 결과물을 정적 파일로 서빙
- **기술 스택**: Spring Boot 3.5.7 + React + Vite + TypeScript + Tailwind CSS

---

## Phase 1: 백엔드 개선 ✅

### 1.1 프로파일 분리
- [x] `application.properties` → 공통 설정만 유지
- [x] `application-dev.properties` 생성 (로컬 개발용)
- [x] `application-prod.properties` 생성 (운영 서버용)

### 1.2 보안 강화
- [x] `JwtTokenProvider.java` - 시크릿 키 외부화 (`@Value` 사용)
- [x] `SecurityConfig.java` - 정적 리소스 허용 추가

### 1.3 새 설정 파일
- [x] `WebConfig.java` 생성 - CORS 설정 (개발 환경용)
- [x] `SpaWebConfig.java` 생성 - SPA 라우팅 설정

### 1.4 기타
- [x] `.gitignore` 업데이트 (민감정보, 빌드 결과물 제외)

---

## Phase 2: 빌드 시스템 통합 ✅

- [x] `build.gradle` 수정
  - Node.js Gradle 플러그인 추가
  - `npmInstall` 태스크 추가
  - `npmBuild` 태스크 추가
  - `copyFrontend` 태스크 추가 (React 빌드 → static 폴더)
  - `processResources`에 의존성 추가

---

## Phase 3: React 프론트엔드 개발 ✅

### 3.1 프로젝트 초기 설정
- [x] `frontend/` 디렉토리에 Vite + React + TypeScript 프로젝트 생성
- [x] Tailwind CSS 설치 및 설정
- [x] `vite.config.ts` 설정 (프록시, 빌드 경로)
- [x] `.env.development`, `.env.production` 환경변수 파일

### 3.2 API 모듈
- [x] `api/axios.ts` - Axios 인스턴스 (인터셉터, 토큰 관리)
- [x] `api/auth.ts` - 로그인/회원가입 API
- [x] `api/menu.ts` - 메뉴 CRUD API
- [x] `api/reservation.ts` - 예약 API
- [x] `api/notice.ts` - 공지사항 API

### 3.3 타입 정의
- [x] `types/index.ts` - Menu, Reservation, Notice, User 타입

### 3.4 Context / Hooks
- [x] `context/AuthContext.tsx` - 인증 상태 관리

### 3.5 공통 컴포넌트
- [x] `components/common/Header.tsx`
- [x] `components/common/Footer.tsx`
- [x] `components/common/Loading.tsx`
- [x] `components/common/AdminLayout.tsx`

### 3.6 고객용 페이지
- [x] `pages/public/HomePage.tsx` - 메인 페이지 (가게 소개)
- [x] `pages/public/MenuPage.tsx` - 메뉴 목록 + 오늘의 메뉴
- [x] `pages/public/ReservationPage.tsx` - 예약 폼
- [x] `pages/public/NoticePage.tsx` - 공지사항 목록

### 3.7 관리자 페이지
- [x] `pages/admin/LoginPage.tsx` - 관리자 로그인
- [x] `pages/admin/DashboardPage.tsx` - 대시보드 (오늘 예약, 통계)
- [x] `pages/admin/MenuManagePage.tsx` - 메뉴 CRUD
- [x] `pages/admin/DailyMenuPage.tsx` - 오늘의 메뉴 관리
- [x] `pages/admin/ReservationManagePage.tsx` - 예약 관리
- [x] `pages/admin/NoticeManagePage.tsx` - 공지사항 관리

### 3.8 라우팅
- [x] `App.tsx` - React Router 설정, 인증 가드

---

## Phase 4: 테스트 ✅

- [x] 로컬에서 백엔드 단독 실행 테스트
- [x] 로컬에서 프론트엔드 개발 서버 테스트
- [x] 통합 빌드 테스트 (`./gradlew bootJar`)
- [x] 통합 JAR 실행 테스트

---

## Phase 5: 배포 ✅

### 5.1 서버 배포 (2026-01-03)
- [x] Ubuntu 서버 설정 (115.68.207.104)
- [x] MySQL 데이터베이스 설정
- [x] Apache2 리버스 프록시 설정
- [x] HTTPS (Let's Encrypt) 설정
- [x] 도메인 연결 (kurumi.hongshin99.com)

---

## Phase 6: Docker 컨테이너화 ✅

### 6.1 Docker 설정 파일 (2026-01-06)
- [x] `Dockerfile` - 멀티 스테이지 빌드 (프론트엔드 → 백엔드 → 실행 이미지)
- [x] `docker-compose.yml` - 컨테이너 실행 설정
- [x] `.dockerignore` - 빌드 제외 파일 설정
- [x] `.env.example` - 환경변수 템플릿

### 6.2 서버 Docker 배포
- [x] Docker 29.1.3 설치
- [x] Docker Compose v5.0.1 설치
- [x] Docker 이미지 빌드 및 배포
- [x] 헬스체크 설정 및 확인

### 6.3 배포 프로세스 개선
- [x] 기존: 6단계 (git pull → npm install → npm build → cp → gradlew → restart)
- [x] Docker: 3단계 (git pull → docker build → docker compose up)

---

## 실행 명령어 참고

### 로컬 개발
```bash
# 프론트엔드 의존성 설치 (최초 1회)
cd frontend && npm install

# 개발 모드 (백엔드)
SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun

# 개발 모드 (프론트엔드 - 별도 터미널)
cd frontend && npm run dev
```

### Docker 배포 (서버)
```bash
# 서버 접속
ssh root@115.68.207.104

# 업데이트 배포
cd /opt/kurumi
git pull
docker compose down && docker build -t kurumi:latest . && docker compose up -d

# 로그 확인
docker compose logs -f

# 컨테이너 상태 확인
docker ps
```

### 로컬 Docker 테스트
```bash
# 이미지 빌드
docker build -t kurumi:latest .

# 실행 (.env 파일 필요)
docker compose up -d

# 접속: http://localhost:8080
```
