#!/bin/bash
# ===========================
# Kurumi 서버 초기 설정 스크립트
# Ubuntu 서버에서 실행
# ===========================

set -e

echo "=== Kurumi 서버 초기 설정 ==="
echo ""

# 1. 시스템 업데이트
echo "[1/6] 시스템 업데이트..."
sudo apt update && sudo apt upgrade -y

# 2. Java 17 설치
echo "[2/6] Java 17 설치..."
sudo apt install -y openjdk-17-jre-headless
java -version

# 3. kurumi 사용자 생성
echo "[3/6] kurumi 사용자 생성..."
if ! id "kurumi" &>/dev/null; then
    sudo useradd -m -s /bin/bash kurumi
    echo "✓ kurumi 사용자 생성됨"
else
    echo "✓ kurumi 사용자 이미 존재"
fi

# 4. 디렉토리 구조 생성
echo "[4/6] 디렉토리 구조 생성..."
sudo mkdir -p /home/kurumi/{app,config,logs,backup,scripts}
sudo chown -R kurumi:kurumi /home/kurumi

# 5. systemd 서비스 파일 생성
echo "[5/6] systemd 서비스 파일 생성..."
sudo tee /etc/systemd/system/kurumi.service > /dev/null << 'EOF'
[Unit]
Description=Kurumi Spring Boot Application
After=network.target

[Service]
Type=simple
User=kurumi
Group=kurumi
WorkingDirectory=/home/kurumi/app

# 환경변수 설정 - 실제 값으로 수정 필요
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="JWT_SECRET=your-production-secret-key-minimum-32-characters-long"
Environment="DB_URL=jdbc:mysql://YOUR_DB_HOST:3306/kurumi?serverTimezone=Asia/Seoul&characterEncoding=UTF-8"
Environment="DB_USERNAME=kurumi_user"
Environment="DB_PASSWORD=your-db-password"
Environment="SERVER_PORT=8080"

ExecStart=/usr/bin/java -jar -Xms256m -Xmx512m /home/kurumi/app/kurumi.jar
ExecStop=/bin/kill -SIGTERM $MAINPID

# 로그 설정
StandardOutput=append:/home/kurumi/logs/kurumi.log
StandardError=append:/home/kurumi/logs/kurumi-error.log

# 재시작 정책
Restart=on-failure
RestartSec=10

# 보안 설정
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF

# 6. 서비스 등록 및 방화벽 설정
echo "[6/6] 서비스 등록 및 방화벽 설정..."
sudo systemctl daemon-reload
sudo systemctl enable kurumi

# 방화벽 설정 (ufw가 설치된 경우)
if command -v ufw &> /dev/null; then
    sudo ufw allow 8080/tcp
    sudo ufw allow 22/tcp
    echo "✓ 방화벽 설정 완료"
fi

echo ""
echo "=== 초기 설정 완료 ==="
echo ""
echo "다음 단계:"
echo "1. /etc/systemd/system/kurumi.service 파일에서 환경변수 수정"
echo "   - JWT_SECRET: 32자 이상의 시크릿 키"
echo "   - DB_URL: 실제 DB 서버 주소"
echo "   - DB_USERNAME, DB_PASSWORD: 실제 DB 계정 정보"
echo ""
echo "2. 환경변수 수정 후 서비스 재로드"
echo "   sudo systemctl daemon-reload"
echo ""
echo "3. JAR 파일 업로드 후 서비스 시작"
echo "   sudo systemctl start kurumi"
echo "   sudo systemctl status kurumi"
echo ""
echo "4. 로그 확인"
echo "   tail -f /home/kurumi/logs/kurumi.log"
