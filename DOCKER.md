# Kurumi Docker 배포 가이드

이 문서는 Kurumi 프로젝트를 Docker로 배포하는 전체 과정을 설명합니다.

---

## 목차

1. [Docker란?](#docker란)
2. [프로젝트 구조](#프로젝트-구조)
3. [Docker 파일 설명](#docker-파일-설명)
4. [로컬에서 Docker 테스트](#로컬에서-docker-테스트)
5. [서버에 Docker 설치](#서버에-docker-설치)
6. [서버 배포](#서버-배포)
7. [배포 명령어 정리](#배포-명령어-정리)

---

## Docker란?

Docker는 애플리케이션과 실행 환경을 하나의 "컨테이너"로 패키징하는 도구입니다.

### 기존 배포 방식의 문제점

```
로컬 (Mac)          서버 (Ubuntu)
Node v25.2.1   →   Node v24.12.0  (버전 다름!)
Java 17        →   Java 17
npm 11.6.2     →   npm 11.6.2

→ 빌드 결과물이 다를 수 있음
→ "내 컴퓨터에서는 되는데?" 문제 발생
```

### Docker 사용 시

```
로컬 (Mac)                     서버 (Ubuntu)
┌─────────────────┐           ┌─────────────────┐
│ Docker 컨테이너  │    =     │ Docker 컨테이너  │
│ - Node v24      │           │ - Node v24      │
│ - Java 17       │           │ - Java 17       │
│ - 앱 코드       │           │ - 앱 코드       │
└─────────────────┘           └─────────────────┘

→ 어디서 실행해도 100% 동일한 환경
```

---

## 프로젝트 구조

```
kurumi/
├── Dockerfile              # Docker 이미지 빌드 설정
├── docker-compose.yml      # 컨테이너 실행 설정
├── .dockerignore           # Docker 빌드 시 제외할 파일
├── src/                    # Spring Boot 백엔드
├── frontend/               # React 프론트엔드
└── uploads/                # 업로드된 이미지 (볼륨 마운트)
```

---

## Docker 파일 설명

### 1. Dockerfile

Dockerfile은 Docker 이미지를 만드는 "레시피"입니다.

```dockerfile
# 이 파일이 하는 일:
# 1단계: Node.js 환경에서 프론트엔드 빌드
# 2단계: Gradle로 백엔드 빌드
# 3단계: 최종 이미지에 빌드된 파일만 복사
```

**멀티 스테이지 빌드**를 사용합니다:
- 빌드에 필요한 도구(Node, Gradle)는 빌드할 때만 사용
- 최종 이미지에는 실행에 필요한 것만 포함
- 결과: 이미지 크기 대폭 감소 (수 GB → 수백 MB)

### 2. docker-compose.yml

여러 설정을 한 파일에 정리해서 실행을 간편하게 합니다.

```yaml
# docker run -p 8080:8080 -v ./uploads:/app/uploads ...
# 이런 긴 명령어 대신
# docker compose up -d 한 줄로 실행
```

### 3. .dockerignore

Docker 빌드 시 불필요한 파일을 제외합니다.
- node_modules (컨테이너 안에서 새로 설치)
- .git (버전 관리 파일 불필요)
- build 결과물 (컨테이너 안에서 새로 빌드)

---

## 로컬에서 Docker 테스트

### 사전 요구사항

- Docker Desktop 설치 (https://docker.com)

### 이미지 빌드

```bash
cd /path/to/kurumi

# Docker 이미지 빌드 (최초 약 5-10분 소요)
docker build -t kurumi:latest .

# 빌드된 이미지 확인
docker images | grep kurumi
```

### 컨테이너 실행

```bash
# docker-compose로 실행 (권장)
docker compose up -d

# 로그 확인
docker compose logs -f

# 중지
docker compose down
```

### 접속 테스트

```
http://localhost:8080        # 메인 페이지
http://localhost:8080/admin  # 관리자 페이지
```

---

## 서버에 Docker 설치

### Ubuntu 서버에 Docker 설치

```bash
# 1. 기존 Docker 제거 (있다면)
sudo apt-get remove docker docker-engine docker.io containerd runc

# 2. 필요한 패키지 설치
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 3. Docker 공식 GPG 키 추가
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Docker 저장소 추가
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Docker 설치
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 6. Docker 서비스 시작
sudo systemctl start docker
sudo systemctl enable docker

# 7. 설치 확인
docker --version
docker compose version
```

---

## 서버 배포

### 방법 1: 서버에서 직접 빌드

```bash
# 1. 서버에 SSH 접속
ssh root@115.68.207.104

# 2. 프로젝트 디렉토리로 이동
cd /opt/kurumi

# 3. 최신 코드 가져오기
git pull

# 4. Docker 이미지 빌드
docker build -t kurumi:latest .

# 5. 기존 컨테이너 중지 및 새 컨테이너 실행
docker compose down
docker compose up -d

# 6. 로그 확인
docker compose logs -f
```

### 방법 2: 로컬에서 빌드 후 이미지 전송

```bash
# 로컬에서
docker build -t kurumi:latest .
docker save kurumi:latest | gzip > kurumi.tar.gz
scp kurumi.tar.gz root@115.68.207.104:/opt/

# 서버에서
docker load < /opt/kurumi.tar.gz
docker compose down && docker compose up -d
```

---

## 배포 명령어 정리

### 기존 배포 방식 (6단계)

```bash
ssh root@115.68.207.104
cd /opt/kurumi
git pull
cd frontend && npm install && npm run build
cp -r dist/* /var/www/kurumi/
cd .. && ./gradlew bootJar
systemctl restart kurumi
```

### Docker 배포 방식 (3단계)

```bash
ssh root@115.68.207.104
cd /opt/kurumi && git pull
docker compose down && docker build -t kurumi:latest . && docker compose up -d
```

### 원라인 배포 (로컬에서 실행)

```bash
ssh root@115.68.207.104 "cd /opt/kurumi && git pull && docker compose down && docker build -t kurumi:latest . && docker compose up -d"
```

---

## 문제 해결

### 컨테이너 로그 확인

```bash
docker compose logs -f
```

### 컨테이너 내부 접속

```bash
docker exec -it kurumi-app bash
```

### 이미지 재빌드 (캐시 무시)

```bash
docker build --no-cache -t kurumi:latest .
```

### 사용하지 않는 이미지 정리

```bash
docker system prune -a
```

---

## 다음 단계 (선택사항)

### GitHub Actions 자동 배포

git push만 하면 자동으로 배포되도록 설정할 수 있습니다.
→ `.github/workflows/deploy.yml` 파일 추가 필요

### Docker Hub 사용

이미지를 Docker Hub에 업로드하면 서버에서 빌드 없이 pull만 하면 됩니다.
→ 빌드 시간 단축, 서버 부하 감소

---

## 실제 설치 및 배포 로그 (2026-01-05)

아래는 실제로 서버에 Docker를 설치하고 배포한 과정입니다.

### 서버 정보

- **서버 IP**: 115.68.207.104
- **OS**: Ubuntu
- **도메인**: kurumi.hongshin99.com

### Step 1: Docker 설치 확인

```bash
$ docker --version
# 결과: Docker not installed
```

### Step 2: Docker 설치

```bash
# 기존 Docker 제거
$ apt-get remove -y docker docker-engine docker.io containerd runc

# 필요한 패키지 설치
$ apt-get update
$ apt-get install -y ca-certificates curl gnupg lsb-release

# Docker GPG 키 추가
$ mkdir -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Docker 저장소 추가
$ echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
$ apt-get update
$ apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Docker 서비스 시작
$ systemctl start docker
$ systemctl enable docker
```

**설치 결과:**
```
=== Docker 설치 완료 ===
Docker version 29.1.3, build f52814d
Docker Compose version v5.0.1
```

### Step 3: Docker 파일 동기화

```bash
# 서버에서 최신 코드 가져오기
$ cd /opt/kurumi
$ git pull
```

### Step 4: Docker 이미지 빌드

```bash
$ docker build -t kurumi:latest .
```

**빌드 결과:**
```
# 빌드 후 추가 예정
```

### Step 5: 기존 서비스 중지

```bash
# 기존 systemd 서비스 중지
$ systemctl stop kurumi
$ systemctl disable kurumi
```

### Step 6: Docker 컨테이너 실행

```bash
$ docker compose up -d
```

**실행 결과:**
```
# 실행 후 추가 예정
```

### Step 7: 동작 확인

```bash
# 컨테이너 상태 확인
$ docker ps

# 로그 확인
$ docker compose logs -f

# API 테스트
$ curl http://localhost:8080/api/menus
```

---

## 참고 자료

- [Docker 공식 문서](https://docs.docker.com)
- [Docker Compose 문서](https://docs.docker.com/compose)
- [Spring Boot Docker 가이드](https://spring.io/guides/topicals/spring-boot-docker)
