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

## Phase 4: 테스트

- [ ] 로컬에서 백엔드 단독 실행 테스트
- [ ] 로컬에서 프론트엔드 개발 서버 테스트
- [ ] 통합 빌드 테스트 (`./gradlew bootJar`)
- [ ] 통합 JAR 실행 테스트

---

## Phase 5: 배포

### 5.1 배포 스크립트 ✅
- [x] `scripts/deploy.sh` - 빌드 → 서버 전송 → 재시작 자동화
- [x] `scripts/server-setup.sh` - 서버 초기 설정 (Java 설치, 사용자 생성)

### 5.2 서버 설정 (서버에서 진행)
- [ ] 서버에 Java 17 설치
- [ ] `kurumi` 사용자 생성
- [ ] 디렉토리 구조 생성 (`/home/kurumi/app`, `logs`, `backup`)
- [ ] systemd 서비스 파일 생성 (`/etc/systemd/system/kurumi.service`)
- [ ] 환경변수 설정 (DB 접속정보, JWT 시크릿)

### 5.3 배포 실행
- [ ] 첫 배포 실행
- [ ] 헬스체크 확인
- [ ] 방화벽 설정 (8080 포트 허용)

### 5.4 선택 사항
- [ ] 도메인 연결
- [ ] Nginx 리버스 프록시 설정
- [ ] HTTPS (Let's Encrypt) 설정

---

## 실행 명령어 참고

```bash
# 프론트엔드 의존성 설치 (최초 1회)
cd frontend && npm install

# 개발 모드 (백엔드)
./gradlew bootRun

# 개발 모드 (프론트엔드 - 별도 터미널)
cd frontend && npm run dev

# 통합 빌드 (배포용)
./gradlew clean bootJar

# 빌드 결과물 위치
# build/libs/kurumi-0.0.1-SNAPSHOT.jar

# 배포 (scripts/deploy.sh 에서 서버 IP 수정 필요)
./scripts/deploy.sh
```

---

## 서버 배포 순서

1. **서버 초기 설정** (최초 1회)
   ```bash
   # 서버에 scripts/server-setup.sh 업로드 후 실행
   chmod +x server-setup.sh
   ./server-setup.sh
   ```

2. **환경변수 수정**
   ```bash
   sudo nano /etc/systemd/system/kurumi.service
   # JWT_SECRET, DB_URL, DB_USERNAME, DB_PASSWORD 수정
   sudo systemctl daemon-reload
   ```

3. **배포**
   ```bash
   # 로컬에서 실행
   ./scripts/deploy.sh
   ```
