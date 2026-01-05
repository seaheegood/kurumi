package dev.hong.kurumi.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FileStorageServiceTest {

    private FileStorageService fileStorageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService();
        ReflectionTestUtils.setField(fileStorageService, "uploadDir", tempDir.toString());
        fileStorageService.init();
    }

    @AfterEach
    void tearDown() throws IOException {
        // 테스트 후 임시 파일 정리
        Files.walk(tempDir)
                .filter(Files::isRegularFile)
                .forEach(path -> {
                    try {
                        Files.delete(path);
                    } catch (IOException ignored) {}
                });
    }

    @Test
    @DisplayName("이미지 파일을 저장하고 URL을 반환한다")
    void storeFile_success() {
        // given
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        // when
        String result = fileStorageService.storeFile(file);

        // then
        assertThat(result).startsWith("/uploads/");
        assertThat(result).endsWith(".jpg");

        // 파일이 실제로 저장되었는지 확인
        String filename = result.substring("/uploads/".length());
        assertThat(Files.exists(tempDir.resolve(filename))).isTrue();
    }

    @Test
    @DisplayName("PNG 파일을 저장한다")
    void storeFile_pngFile() {
        // given
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image.png",
                "image/png",
                "png content".getBytes()
        );

        // when
        String result = fileStorageService.storeFile(file);

        // then
        assertThat(result).endsWith(".png");
    }

    @Test
    @DisplayName("확장자가 없는 파일도 저장한다")
    void storeFile_noExtension() {
        // given
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "noextension",
                "image/jpeg",
                "content".getBytes()
        );

        // when
        String result = fileStorageService.storeFile(file);

        // then
        assertThat(result).startsWith("/uploads/");
        // UUID만 있고 확장자 없음
    }

    @Test
    @DisplayName("파일을 삭제한다")
    void deleteFile_success() throws IOException {
        // given
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "to-delete.jpg",
                "image/jpeg",
                "delete me".getBytes()
        );
        String fileUrl = fileStorageService.storeFile(file);
        String filename = fileUrl.substring("/uploads/".length());
        assertThat(Files.exists(tempDir.resolve(filename))).isTrue();

        // when
        fileStorageService.deleteFile(fileUrl);

        // then
        assertThat(Files.exists(tempDir.resolve(filename))).isFalse();
    }

    @Test
    @DisplayName("존재하지 않는 파일 삭제 시 예외가 발생하지 않는다")
    void deleteFile_nonExistentFile() {
        // given
        String nonExistentUrl = "/uploads/non-existent-file.jpg";

        // when & then - 예외 발생하지 않음
        fileStorageService.deleteFile(nonExistentUrl);
    }

    @Test
    @DisplayName("uploads로 시작하지 않는 URL은 삭제하지 않는다")
    void deleteFile_invalidUrl() {
        // given
        String invalidUrl = "/other/path/file.jpg";

        // when & then - 예외 발생하지 않음
        fileStorageService.deleteFile(invalidUrl);
    }

    @Test
    @DisplayName("null URL은 안전하게 처리한다")
    void deleteFile_nullUrl() {
        // when & then - 예외 발생하지 않음
        fileStorageService.deleteFile(null);
    }

    @Test
    @DisplayName("저장된 파일은 고유한 UUID 이름을 가진다")
    void storeFile_uniqueFilenames() {
        // given
        MockMultipartFile file1 = new MockMultipartFile(
                "file",
                "same-name.jpg",
                "image/jpeg",
                "content1".getBytes()
        );
        MockMultipartFile file2 = new MockMultipartFile(
                "file",
                "same-name.jpg",
                "image/jpeg",
                "content2".getBytes()
        );

        // when
        String url1 = fileStorageService.storeFile(file1);
        String url2 = fileStorageService.storeFile(file2);

        // then
        assertThat(url1).isNotEqualTo(url2);
    }

    @Test
    @DisplayName("업로드 디렉토리가 자동으로 생성된다")
    void init_createsDirectory() {
        // given
        Path newDir = tempDir.resolve("new-upload-dir");
        FileStorageService newService = new FileStorageService();
        ReflectionTestUtils.setField(newService, "uploadDir", newDir.toString());

        // when
        newService.init();

        // then
        assertThat(Files.exists(newDir)).isTrue();
        assertThat(Files.isDirectory(newDir)).isTrue();
    }
}
