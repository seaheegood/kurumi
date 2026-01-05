# Kurumi 업데이트 및 배포 가이드

> 배포 URL: https://kurumi.hongshin99.com

---

## 배포 방법 (Docker)

### 업데이트 배포
```bash
cd /opt/kurumi && git pull && docker compose down && docker build -t kurumi:latest . && docker compose up -d
```

### 배포 확인
```bash
docker ps                                                    # 컨테이너 상태
docker inspect --format='{{.State.Health.Status}}' kurumi-app  # 헬스체크
docker compose logs -f                                       # 로그
```

자세한 Docker 설정은 [DOCKER.md](./DOCKER.md) 참조

---

## 버전 기록

### v1.2.0 (2026-01-06) - 현재 버전

**Docker 컨테이너화**
- 로컬/서버 Node.js 버전 차이로 인한 빌드 불일치 문제 해결
- 배포 프로세스 단순화 (6단계 → 3단계)
- 멀티 스테이지 빌드로 이미지 최적화

**새로운 파일**
- `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example`

**서버 환경**
- Docker 29.1.3, Docker Compose v5.0.1

---

### v1.1.0 (2026-01-05)

**새 기능**
- 오늘의 메뉴 유지 기능 (다음날에도 그대로 표시)
- 이미지 파일 업로드 (최대 10MB)
- 오늘의 메뉴 템플릿 선택 기능
- 이미지 자동 정리 (메뉴당 1개만 유지)
- 관리자 대시보드 개선

**제거**
- 예약 서비스 전체 삭제

---

### v1.0.0 (2026-01-03) - 최초 배포

**기능**
- 메뉴 관리 (CRUD)
- 오늘의 메뉴 관리
- 공지사항 관리
- 관리자 인증 (JWT)
- 반응형 웹 디자인

**배포 환경**
- 서버: Ubuntu (115.68.207.104)
- 도메인: kurumi.hongshin99.com
- 웹서버: Apache2 + Let's Encrypt SSL
- 백엔드: Spring Boot 3.5.7
- 데이터베이스: MySQL (외부 서버)
