# Kurumi 프로젝트 개발 완료

> 프로젝트 기간: 2026-01-03 ~ 2026-01-06
> 배포 URL: https://kurumi.hongshin99.com

---

## 완료된 작업

### Phase 1: 백엔드 구축 ✅
- Spring Boot 3.5.7 프로젝트 설정
- Spring Security + JWT 인증 구현
- Spring Data JPA 엔티티 및 레포지토리
- REST API 컨트롤러 (메뉴, 오늘의 메뉴, 공지사항)
- 파일 업로드 서비스
- 프로파일 분리 (dev/prod)

### Phase 2: 프론트엔드 구축 ✅
- Vite + React + TypeScript 프로젝트 생성
- Tailwind CSS 스타일링
- Axios API 모듈 (인터셉터, 토큰 관리)
- AuthContext 인증 상태 관리
- 고객용 페이지 (홈, 메뉴, 공지사항)
- 관리자 페이지 (대시보드, 메뉴 관리, 오늘의 메뉴, 공지사항)

### Phase 3: 빌드 시스템 통합 ✅
- Gradle + Node.js 플러그인 연동
- 프론트엔드 빌드 → Spring Boot static 폴더 복사 자동화
- 단일 JAR 파일로 통합 빌드

### Phase 4: 서버 배포 ✅
- Ubuntu 서버 설정 (115.68.207.104)
- Apache2 리버스 프록시 + SSL (Let's Encrypt)
- 도메인 연결 (kurumi.hongshin99.com)
- MySQL 외부 서버 연동

### Phase 5: 기능 개선 ✅
- 오늘의 메뉴 유지 기능
- 이미지 파일 업로드 (최대 10MB)
- 오늘의 메뉴 템플릿 선택
- 이미지 자동 정리
- 관리자 대시보드 개선
- 예약 기능 제거 (불필요)

### Phase 6: Docker 컨테이너화 ✅
- Dockerfile 멀티 스테이지 빌드
- docker-compose.yml 설정
- 환경변수 외부화 (.env)
- 서버 Docker 배포 완료
- 배포 프로세스 단순화 (6단계 → 3단계)

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Backend | Spring Boot 3.5.7, Spring Security, Spring Data JPA, JWT |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Database | MySQL 8.0 |
| DevOps | Docker, Docker Compose, Apache2, Let's Encrypt |
| Server | Ubuntu (iwinv) |

---

## 실행 명령어

### 로컬 개발
```bash
# 백엔드
SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun

# 프론트엔드 (별도 터미널)
cd frontend && npm run dev
```

### 서버 배포
```bash
cd /opt/kurumi && git pull && docker compose down && docker build -t kurumi:latest . && docker compose up -d
```
