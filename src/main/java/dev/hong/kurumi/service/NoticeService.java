package dev.hong.kurumi.service;

import dev.hong.kurumi.entity.Notice;
import dev.hong.kurumi.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    public Optional<Notice> getNotice(Long id) {
        return noticeRepository.findById(id);
    }

    public Notice createNotice(Notice notice) {
        notice.setCreatedAt(LocalDateTime.now());
        return noticeRepository.save(notice);
    }

    public Notice updateNotice(Long id, Notice updated) {
        return noticeRepository.findById(id)
                .map(notice -> {
                    notice.setTitle(updated.getTitle());
                    notice.setContent(updated.getContent());
                    return noticeRepository.save(notice);
                })
                .orElseThrow(() -> new RuntimeException("Notice not found"));
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}
