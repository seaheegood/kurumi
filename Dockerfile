# ==============================================
# Kurumi Docker 빌드 파일
# ==============================================
# 멀티 스테이지 빌드를 사용합니다:
# 1단계: 프론트엔드 빌드 (Node.js)
# 2단계: 백엔드 빌드 (Gradle)
# 3단계: 최종 실행 이미지 (JRE만 포함)
# ==============================================

# ----------------------------------------------
# Stage 1: 프론트엔드 빌드
# ----------------------------------------------
FROM node:24-alpine AS frontend-builder

WORKDIR /app/frontend

# package.json 먼저 복사 (캐시 활용)
COPY frontend/package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사 및 빌드
COPY frontend/ ./
RUN npm run build

# 결과물: /app/frontend/dist 폴더에 빌드된 파일


# ----------------------------------------------
# Stage 2: 백엔드 빌드
# ----------------------------------------------
FROM gradle:8.11-jdk17 AS backend-builder

WORKDIR /app

# Gradle 설정 파일 먼저 복사 (캐시 활용)
COPY build.gradle settings.gradle ./
COPY gradle ./gradle

# 소스 코드 복사
COPY src ./src

# 프론트엔드 빌드 결과물을 static 폴더로 복사
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# 백엔드 빌드 (테스트 제외)
RUN gradle bootJar -x test --no-daemon

# 결과물: /app/build/libs/kurumi-0.0.1-SNAPSHOT.jar


# ----------------------------------------------
# Stage 3: 최종 실행 이미지
# ----------------------------------------------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=backend-builder /app/build/libs/kurumi-0.0.1-SNAPSHOT.jar app.jar

# uploads 폴더 생성 (이미지 업로드용)
RUN mkdir -p /app/uploads

# 포트 노출
EXPOSE 8080

# 환경 변수 기본값
ENV SPRING_PROFILES_ACTIVE=prod
ENV TZ=Asia/Seoul

# 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
