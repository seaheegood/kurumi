# Kurumi

식당/주점 관리를 위한 풀스택 웹 애플리케이션

> **Live Site**: https://kurumi.hongshin99.com

## 기술 스택

### Backend
- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Security + JWT** (인증/인가)
- **Spring Data JPA** (ORM)
- **MySQL** (데이터베이스)
- **Gradle** (빌드 도구)

### Frontend
- **React 18**
- **TypeScript**
- **Vite** (빌드 도구)
- **Tailwind CSS** (스타일링)
- **React Router** (라우팅)
- **Axios** (HTTP 클라이언트)

### DevOps
- **Docker** (컨테이너화)
- **Docker Compose** (컨테이너 오케스트레이션)
- **Apache2** (리버스 프록시, SSL)

## 주요 기능

| 기능 | 설명 |
|------|------|
| 메뉴 관리 | 안주/주류/음료 카테고리별 메뉴 CRUD |
| 오늘의 메뉴 | 날짜별 일일 특선 메뉴 관리, 템플릿 선택 기능 |
| 이미지 업로드 | 메뉴 이미지 직접 업로드 (최대 10MB) |
| 공지사항 | 매장 공지사항 관리 |
| 관리자 대시보드 | 통계 및 빠른 관리 기능 |
| 사용자 인증 | JWT 기반 로그인 |
| 반응형 디자인 | 모바일/데스크톱 지원 |

## 프로젝트 구조

```
kurumi/
├── src/                          # Backend (Spring Boot)
│   └── main/
│       ├── java/dev/hong/kurumi/
│       │   ├── config/           # Security, JWT, Web 설정
│       │   ├── controller/       # REST API 컨트롤러
│       │   ├── entity/           # JPA 엔티티
│       │   ├── repository/       # 데이터 접근 계층
│       │   ├── service/          # 비즈니스 로직
│       │   └── KurumiApplication.java
│       └── resources/
│           └── application.properties
│
├── frontend/                     # Frontend (React)
│   ├── src/
│   │   ├── api/                  # API 호출 모듈
│   │   ├── components/           # 재사용 컴포넌트
│   │   │   └── common/           # Header, Footer, AdminLayout
│   │   ├── context/              # React Context (Auth)
│   │   ├── pages/
│   │   │   ├── admin/            # 관리자 페이지
│   │   │   └── public/           # 공개 페이지
│   │   ├── types/                # TypeScript 타입 정의
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── uploads/                      # 업로드된 이미지 저장 폴더
├── Dockerfile                    # Docker 이미지 빌드 설정
├── docker-compose.yml            # Docker 컨테이너 실행 설정
├── .dockerignore                 # Docker 빌드 제외 파일
├── .env.example                  # 환경변수 템플릿
├── build.gradle
├── UPDATE.md                     # 버전 업데이트 로그
└── README.md
```

## API 엔드포인트

### 인증 (`/api/auth`)
| Method | Endpoint | 설명 | 접근 권한 |
|--------|----------|------|----------|
| POST | `/register` | 회원가입 | Public |
| POST | `/login` | 로그인 (JWT 토큰 반환) | Public |

### 메뉴 (`/api/menus`)
| Method | Endpoint | 설명 | 접근 권한 |
|--------|----------|------|----------|
| GET | `/` | 전체 메뉴 조회 | Public |
| GET | `/{id}` | 메뉴 상세 조회 | Public |
| POST | `/admin` | 메뉴 생성 | Admin |
| PUT | `/admin/{id}` | 메뉴 수정 | Admin |
| DELETE | `/admin/{id}` | 메뉴 삭제 | Admin |

### 오늘의 메뉴 (`/api/daily-menu`)
| Method | Endpoint | 설명 | 접근 권한 |
|--------|----------|------|----------|
| GET | `/` | 오늘의 메뉴 조회 (없으면 최근 메뉴) | Public |
| GET | `/admin/{date}` | 특정 날짜 메뉴 조회 | Admin |
| GET | `/admin/templates` | 메뉴 템플릿 목록 조회 | Admin |
| POST | `/admin` | 일일 메뉴 등록 | Admin |
| PUT | `/admin/{id}` | 일일 메뉴 수정 | Admin |
| DELETE | `/admin/{id}` | 일일 메뉴 삭제 | Admin |

### 파일 업로드 (`/api/upload`)
| Method | Endpoint | 설명 | 접근 권한 |
|--------|----------|------|----------|
| POST | `/image` | 이미지 파일 업로드 (최대 10MB) | Admin |

### 공지사항 (`/api/notices`)
| Method | Endpoint | 설명 | 접근 권한 |
|--------|----------|------|----------|
| GET | `/` | 전체 공지 조회 | Public |
| GET | `/{id}` | 공지 상세 조회 | Public |
| POST | `/admin` | 공지 작성 | Admin |
| PUT | `/admin/{id}` | 공지 수정 | Admin |
| DELETE | `/admin/{id}` | 공지 삭제 | Admin |

---

## 로컬 개발 환경

### 사전 요구사항
- Java 17+
- Node.js 18+
- MySQL 8.x

### 1. 데이터베이스 설정
```sql
CREATE DATABASE kurumi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 백엔드 설정
`src/main/resources/application-dev.properties` 파일 생성:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/kurumi
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. 백엔드 서버 실행
```bash
SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun
```
백엔드 서버: `http://localhost:8080`

### 4. 프론트엔드 서버 실행
```bash
cd frontend
npm install
npm run dev
```
프론트엔드 서버: `http://localhost:3000`

### 5. 관리자 계정 생성
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password","role":"ADMIN"}'
```

---

## 배포

Docker를 사용하여 배포합니다.

- 배포 방법: [DEPLOY.md](./DEPLOY.md)
- Docker 설정 상세: [DOCKER.md](./DOCKER.md)

---

## 인증 방식

JWT Bearer Token 사용

```bash
# 로그인 요청
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# 인증이 필요한 API 호출
curl -X GET http://localhost:8080/api/daily-menu/admin/templates \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 버전 정보

현재 버전: **v1.2.0** (2026-01-06)

자세한 업데이트 내역은 [UPDATE.md](./UPDATE.md) 참조
