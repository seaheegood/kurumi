package dev.hong.kurumi.controller;

import dev.hong.kurumi.entity.User;
import dev.hong.kurumi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    // ✅ 관리자 회원가입 (최초 1회만)
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.createAdmin(user));
    }

    // ✅ 로그인
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        return userService.findByUsername(user.getUsername())
                .filter(u -> passwordEncoder.matches(user.getPassword(), u.getPassword()))
                .map(u -> ResponseEntity.ok("Login success"))
                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }
}
