# Kurumi

식당/주점 관리를 위한 Spring Boot REST API 서버

## 기술 스택

- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Security + JWT** (인증/인가)
- **Spring Data JPA** (ORM)
- **MySQL** (데이터베이스)
- **Gradle** (빌드 도구)

## 주요 기능

| 기능 | 설명 |
|------|------|
| 메뉴 관리 | 안주/주류 등 카테고리별 메뉴 CRUD |
| 오늘의 메뉴 | 날짜별 일일 특선 메뉴 관리 |
| 예약 관리 | 고객 예약 접수 및 조회 |
| 공지사항 | 매장 공지사항 관리 |
| 사용자 인증 | JWT 기반 로그인/회원가입 |

## 프로젝트 구조

```
src/main/java/dev/hong/kurumi
├── config/          # Security, JWT 설정
├── controller/      # REST API 컨트롤러
├── entity/          # JPA 엔티티
├── repository/      # 데이터 접근 계층
├── service/         # 비즈니스 로직
└── KurumiApplication.java
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
| GET | `/` | 오늘의 메뉴 조회 | Public |
| GET | `/admin/{date}` | 특정 날짜 메뉴 조회 | Admin |
| POST | `/admin` | 일일 메뉴 등록/수정 | Admin |
| DELETE | `/admin/{id}` | 일일 메뉴 삭제 | Admin |

### 예약 (`/api/reservations`)
| Method | Endpoint | 설명 | 접근 권한 |
|--------|----------|------|----------|
| POST | `/` | 예약 생성 | Authenticated |
| GET | `/admin` | 전체 예약 조회 | Admin |
| GET | `/admin/{date}` | 날짜별 예약 조회 | Admin |
| DELETE | `/admin/{id}` | 예약 삭제 | Admin |

### 공지사항 (`/api/notices`)
| Method | Endpoint | 설명 | 접근 권한 |
|--------|----------|------|----------|
| GET | `/` | 전체 공지 조회 | Public |
| GET | `/{id}` | 공지 상세 조회 | Public |
| POST | `/admin` | 공지 작성 | Admin |
| PUT | `/admin/{id}` | 공지 수정 | Admin |
| DELETE | `/admin/{id}` | 공지 삭제 | Admin |

## 실행 방법

### 1. 사전 요구사항
- Java 17+
- MySQL 8.x

### 2. 데이터베이스 설정
```sql
CREATE DATABASE kurumi;
```

### 3. 설정 파일 수정
`src/main/resources/application.properties`에서 DB 접속 정보 수정:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/kurumi
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. 빌드 및 실행
```bash
# 빌드
./gradlew build

# 실행
./gradlew bootRun
```

서버: `http://localhost:8080`

## 인증 방식

JWT Bearer Token 사용

```bash
# 로그인 요청
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# 인증이 필요한 API 호출
curl -X GET http://localhost:8080/api/reservations/admin \
  -H "Authorization: Bearer {TOKEN}"
```
