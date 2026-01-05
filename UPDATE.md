# Kurumi Update Log

## v1.1.0 (2026-01-05)

### Features

#### 1. 오늘의 메뉴 유지 기능
- 오늘의 메뉴를 한번 설정하면 다음날에도 수정하지 않는 한 그대로 유지
- 오늘 날짜에 메뉴가 없을 경우 가장 최근에 등록된 메뉴를 자동으로 표시

**변경 파일:**
- `src/main/java/dev/hong/kurumi/repository/DailyMenuRepository.java`
- `src/main/java/dev/hong/kurumi/service/DailyMenuService.java`

#### 2. 이미지 파일 업로드 기능
- 메뉴 및 오늘의 메뉴에 핸드폰/컴퓨터에서 직접 이미지 파일 업로드 가능
- 기존 URL 입력 방식도 유지
- 최대 10MB 이미지 파일 지원

**신규 파일:**
- `src/main/java/dev/hong/kurumi/service/FileStorageService.java`
- `src/main/java/dev/hong/kurumi/controller/FileUploadController.java`

**변경 파일:**
- `src/main/java/dev/hong/kurumi/config/WebConfig.java`
- `src/main/java/dev/hong/kurumi/config/SpaWebConfig.java`
- `src/main/java/dev/hong/kurumi/config/SecurityConfig.java`
- `frontend/src/api/menu.ts`
- `frontend/src/pages/admin/MenuManagePage.tsx`
- `frontend/src/pages/admin/DailyMenuPage.tsx`

#### 3. 메뉴 카테고리 개선
- "전체" 탭 제거
- 카테고리: 안주, 주류, 음료

**변경 파일:**
- `frontend/src/pages/public/MenuPage.tsx`
- `frontend/src/pages/admin/MenuManagePage.tsx`

#### 4. 오늘의 메뉴 템플릿 선택 기능
- 이전에 등록했던 오늘의 메뉴 목록에서 선택하여 바로 추가 가능
- 매번 새로 입력할 필요 없이 기존 메뉴 재사용
- 템플릿 수정 기능 (이름, 가격, 설명, 이미지 변경)

**변경 파일:**
- `src/main/java/dev/hong/kurumi/repository/DailyMenuRepository.java` - 템플릿 조회 쿼리 추가
- `src/main/java/dev/hong/kurumi/service/DailyMenuService.java` - 템플릿 조회/수정 메서드 추가
- `src/main/java/dev/hong/kurumi/controller/DailyMenuController.java` - 템플릿 API 추가
- `frontend/src/api/menu.ts` - 템플릿 API 연동
- `frontend/src/pages/admin/DailyMenuPage.tsx` - 템플릿 선택 UI 추가

#### 5. 이미지 자동 정리 기능
- 메뉴당 이미지 1개만 저장
- 이미지 변경 시 기존 이미지 파일 서버에서 자동 삭제
- 불필요한 이미지 파일 축적 방지

**변경 파일:**
- `src/main/java/dev/hong/kurumi/service/DailyMenuService.java` - 이미지 삭제 로직 추가
- `src/main/java/dev/hong/kurumi/service/FileStorageService.java` - 파일 삭제 메서드 추가

#### 6. 관리자 대시보드 개선
- 오늘 날짜 표시
- 통계 카드 클릭 시 해당 관리 페이지로 이동
- 오늘의 메뉴 현황 (이미지 포함)
- 최근 공지사항 미리보기
- 등록된 메뉴 목록 표시
- 각 섹션별 바로가기 링크

**변경 파일:**
- `frontend/src/pages/admin/DashboardPage.tsx` - 대시보드 UI 전면 개선
- `frontend/src/components/common/AdminLayout.tsx` - 메뉴 라벨 개선

### Removed

#### 예약 서비스 제거
- 예약 기능 전체 삭제

**삭제된 백엔드 파일:**
- `src/main/java/dev/hong/kurumi/entity/Reservation.java`
- `src/main/java/dev/hong/kurumi/repository/ReservationRepository.java`
- `src/main/java/dev/hong/kurumi/service/ReservationService.java`
- `src/main/java/dev/hong/kurumi/controller/ReservationController.java`

**삭제된 프론트엔드 파일:**
- `frontend/src/pages/public/ReservationPage.tsx`
- `frontend/src/pages/admin/ReservationManagePage.tsx`
- `frontend/src/api/reservation.ts`

**변경 파일:**
- `frontend/src/App.tsx`
- `frontend/src/components/common/Header.tsx`
- `frontend/src/components/common/AdminLayout.tsx`
- `frontend/src/pages/admin/DashboardPage.tsx`
- `frontend/src/types/index.ts`
- `src/main/java/dev/hong/kurumi/config/SecurityConfig.java`

---

## v1.0.0 (Initial Release)

- 메뉴 관리 (CRUD)
- 오늘의 메뉴 관리
- 공지사항 관리
- 예약 관리
- 관리자 인증 (JWT)
- 반응형 웹 디자인
