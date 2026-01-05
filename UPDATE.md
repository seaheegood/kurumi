# Kurumi Update Log

## v1.1.0 (2026-01-05) - 현재 배포 버전

> 배포 URL: https://kurumi.hongshin99.com

### New Features

#### 1. 오늘의 메뉴 유지 기능
- 오늘의 메뉴를 한번 설정하면 다음날에도 수정하지 않는 한 그대로 유지
- 오늘 날짜에 메뉴가 없을 경우 가장 최근에 등록된 메뉴를 자동으로 표시

#### 2. 이미지 파일 업로드 기능
- 메뉴 및 오늘의 메뉴에 핸드폰/컴퓨터에서 직접 이미지 파일 업로드 가능
- 최대 10MB 이미지 파일 지원
- 업로드된 이미지는 서버의 `/uploads` 폴더에 저장

#### 3. 메뉴 카테고리 개선
- "전체" 탭 제거
- 카테고리: 안주, 주류, 음료

#### 4. 오늘의 메뉴 템플릿 선택 기능
- 이전에 등록했던 오늘의 메뉴 목록에서 선택하여 바로 추가 가능
- 매번 새로 입력할 필요 없이 기존 메뉴 재사용
- 템플릿 수정 기능 (이름, 가격, 설명, 이미지 변경)

#### 5. 이미지 자동 정리 기능
- 메뉴당 이미지 1개만 저장
- 이미지 변경 시 기존 이미지 파일 서버에서 자동 삭제
- 불필요한 이미지 파일 축적 방지

#### 6. 관리자 대시보드 개선
- 오늘 날짜 표시
- 통계 카드 클릭 시 해당 관리 페이지로 이동
- 오늘의 메뉴 현황 (이미지 포함)
- 최근 공지사항 미리보기
- 등록된 메뉴 목록 표시
- 각 섹션별 바로가기 링크

### Removed

#### 예약 서비스 제거
- 예약 기능 전체 삭제 (프론트엔드 + 백엔드)

### Changed Files

**신규 파일:**
- `src/main/java/dev/hong/kurumi/service/FileStorageService.java`
- `src/main/java/dev/hong/kurumi/controller/FileUploadController.java`

**변경 파일:**
- `src/main/java/dev/hong/kurumi/repository/DailyMenuRepository.java`
- `src/main/java/dev/hong/kurumi/service/DailyMenuService.java`
- `src/main/java/dev/hong/kurumi/controller/DailyMenuController.java`
- `src/main/java/dev/hong/kurumi/config/WebConfig.java`
- `src/main/java/dev/hong/kurumi/config/SpaWebConfig.java`
- `src/main/java/dev/hong/kurumi/config/SecurityConfig.java`
- `frontend/src/api/menu.ts`
- `frontend/src/pages/admin/MenuManagePage.tsx`
- `frontend/src/pages/admin/DailyMenuPage.tsx`
- `frontend/src/pages/admin/DashboardPage.tsx`
- `frontend/src/pages/public/MenuPage.tsx`
- `frontend/src/pages/public/HomePage.tsx`
- `frontend/src/components/common/Header.tsx`
- `frontend/src/components/common/AdminLayout.tsx`
- `frontend/src/App.tsx`
- `frontend/src/types/index.ts`

**삭제된 파일:**
- `src/main/java/dev/hong/kurumi/entity/Reservation.java`
- `src/main/java/dev/hong/kurumi/repository/ReservationRepository.java`
- `src/main/java/dev/hong/kurumi/service/ReservationService.java`
- `src/main/java/dev/hong/kurumi/controller/ReservationController.java`
- `frontend/src/pages/public/ReservationPage.tsx`
- `frontend/src/pages/admin/ReservationManagePage.tsx`
- `frontend/src/api/reservation.ts`

### Deployment Info

- **서버**: Ubuntu (115.68.207.104)
- **도메인**: kurumi.hongshin99.com
- **웹서버**: Apache2 (프론트엔드 서빙 + API 프록시)
- **백엔드**: Spring Boot (포트 8080, systemd 서비스)
- **데이터베이스**: MySQL (외부 서버)

---

## v1.0.0 (2026-01-03) - Initial Release

- 메뉴 관리 (CRUD)
- 오늘의 메뉴 관리
- 공지사항 관리
- 예약 관리
- 관리자 인증 (JWT)
- 반응형 웹 디자인
