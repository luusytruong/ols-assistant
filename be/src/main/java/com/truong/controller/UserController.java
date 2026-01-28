package com.truong.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.truong.domain.dto.request.UserRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.UserResponse;
import com.truong.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        return userService.createUser(request);
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public ApiResponse<UserResponse> updateUser(@PathVariable Integer id, @Valid @RequestBody UserRequest request) {
        return userService.updateUser(id, request);
    }

    @PatchMapping("/{id}")
    public ApiResponse<UserResponse> patchUser(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        return userService.patchUser(id, updates);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Integer id) {
        return userService.deleteUser(id);
    }
}
