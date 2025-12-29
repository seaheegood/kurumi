#!/bin/bash
set -e

# ===========================
# Kurumi 배포 스크립트
# ===========================

# 설정 - 서버 정보 수정 필요
APP_NAME="kurumi"
REMOTE_USER="kurumi"          # 서버 사용자명
REMOTE_HOST="YOUR_SERVER_IP"  # 서버 IP 주소
REMOTE_DIR="/home/kurumi/app"
JAR_FILE="build/libs/kurumi-0.0.1-SNAPSHOT.jar"

echo "=== Kurumi 배포 시작 ==="
echo ""

# 1. 빌드
echo "[1/5] 프로젝트 빌드 중..."
./gradlew clean bootJar -x test
echo "✓ 빌드 완료"
echo ""

# 2. JAR 파일 확인
if [ ! -f "$JAR_FILE" ]; then
    echo "ERROR: JAR 파일을 찾을 수 없습니다: $JAR_FILE"
    exit 1
fi
echo "[2/5] JAR 파일 확인: $(ls -lh $JAR_FILE | awk '{print $5}')"
echo ""

# 3. 서버로 전송
echo "[3/5] JAR 파일 전송 중..."
scp "$JAR_FILE" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/${APP_NAME}-new.jar"
echo "✓ 전송 완료"
echo ""

# 4. 서버에서 배포 실행
echo "[4/5] 서버에서 배포 실행 중..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" << 'REMOTE_SCRIPT'
    cd /home/kurumi/app

    # 기존 JAR 백업
    if [ -f kurumi.jar ]; then
        echo "  - 기존 JAR 백업 중..."
        cp kurumi.jar ../backup/kurumi-backup-$(date +%Y%m%d_%H%M%S).jar
    fi

    # 새 JAR로 교체
    echo "  - 새 JAR 적용 중..."
    mv kurumi-new.jar kurumi.jar

    # 서비스 재시작
    echo "  - 서비스 재시작 중..."
    sudo systemctl restart kurumi

    # 잠시 대기 후 상태 확인
    sleep 5
    if sudo systemctl is-active --quiet kurumi; then
        echo "✓ 서비스 정상 실행 중"
    else
        echo "✗ 서비스 시작 실패"
        sudo systemctl status kurumi --no-pager
        exit 1
    fi
REMOTE_SCRIPT
echo ""

# 5. 헬스체크
echo "[5/5] 헬스체크 중..."
sleep 5
if curl -s --max-time 10 "http://${REMOTE_HOST}:8080/api/menus" > /dev/null; then
    echo "✓ 헬스체크 성공"
else
    echo "⚠ 헬스체크 실패 - 로그를 확인하세요"
fi

echo ""
echo "=== 배포 완료 ==="
echo "URL: http://${REMOTE_HOST}:8080"
