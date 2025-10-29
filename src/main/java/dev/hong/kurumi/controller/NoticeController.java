package dev.hong.kurumi.controller;

import dev.hong.kurumi.entity.Notice;
import dev.hong.kurumi.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    // ✅ 공지 목록 (손님)
    @GetMapping
    public ResponseEntity<List<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    // ✅ 공지 상세 (손님)
    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNotice(@PathVariable Long id) {
        return noticeService.getNotice(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ 공지 등록 (관리자)
    @PostMapping("/admin")
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        return ResponseEntity.ok(noticeService.createNotice(notice));
    }

    // ✅ 공지 수정 (관리자)
    @PutMapping("/admin/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable Long id, @RequestBody Notice notice) {
        return ResponseEntity.ok(noticeService.updateNotice(id, notice));
    }

    // ✅ 공지 삭제 (관리자)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
