# Kurumi

식당/주점 관리를 위한 풀스택 웹 애플리케이션

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

## 주요 기능

| 기능 | 설명 |
|------|------|
| 메뉴 관리 | 안주/주류 등 카테고리별 메뉴 CRUD |
| 오늘의 메뉴 | 날짜별 일일 특선 메뉴 관리 |
| 예약 관리 | 고객 예약 접수 및 조회 |
| 공지사항 | 매장 공지사항 관리 |
| 사용자 인증 | JWT 기반 로그인/회원가입 |
| 반응형 디자인 | 모바일/데스크톱 지원 |

## 프로젝트 구조

```
kurumi/
├── src/                          # Backend (Spring Boot)
│   └── main/
│       ├── java/dev/hong/kurumi/
│       │   ├── config/           # Security, JWT 설정
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
├── build.gradle
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

## 배포 (Ubuntu + Apache2)

### 서버 요구사항
- Ubuntu 20.04/22.04 LTS
- Java 17+
- Node.js 18+
- Apache2
- MySQL (외부 서버 가능)
- SSL 인증서 (Let's Encrypt 권장)

### 배포 단계

#### 1. 프로젝트 클론
```bash
cd /opt
git clone https://github.com/your-repo/kurumi.git
```

#### 2. 백엔드 설정
`src/main/resources/application-prod.properties` 파일 생성:
```properties
spring.datasource.url=jdbc:mysql://your-db-host:3306/kurumi
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

jwt.secret=your_long_secret_key_minimum_64_characters
jwt.expiration=3600000
```

#### 3. 백엔드 빌드 및 서비스 등록
```bash
cd /opt/kurumi
./gradlew bootJar
```

systemd 서비스 파일 생성 (`/etc/systemd/system/kurumi.service`):
```ini
[Unit]
Description=Kurumi Backend API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/kurumi
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod /opt/kurumi/build/libs/kurumi-0.0.1-SNAPSHOT.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable kurumi
systemctl start kurumi
```

#### 4. 프론트엔드 빌드
```bash
cd /opt/kurumi/frontend
echo "VITE_API_BASE_URL=https://your-domain.com" > .env.production
npm install
npm run build
```

#### 5. Apache 설정
```bash
mkdir -p /var/www/kurumi
cp -r /opt/kurumi/frontend/dist/* /var/www/kurumi/
```

Apache 가상호스트 설정 (`/etc/apache2/sites-available/kurumi.conf`):
```apache
<VirtualHost *:443>
    ServerName your-domain.com

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem

    DocumentRoot /var/www/kurumi

    <Directory /var/www/kurumi>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    ProxyPass /api http://localhost:8080/api
    ProxyPassReverse /api http://localhost:8080/api
</VirtualHost>
```

```bash
a2enmod proxy proxy_http rewrite ssl
a2ensite kurumi.conf
systemctl reload apache2
```

### 업데이트 배포
```bash
cd /opt/kurumi
git pull origin main

# 백엔드
./gradlew clean bootJar
systemctl restart kurumi

# 프론트엔드
cd frontend
npm run build
cp -r dist/* /var/www/kurumi/
```

---

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
