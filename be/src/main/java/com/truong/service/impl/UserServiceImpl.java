package com.truong.service.impl;

import java.util.List;
import java.util.Map;

import com.truong.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.truong.domain.dto.request.UserRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.UserResponse;
import com.truong.domain.entity.User;
import com.truong.exception.DuplicateResourceException;
import com.truong.exception.ResourceNotFoundException;
import com.truong.repository.UserRepository;
import com.truong.service.UserService;

import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public ApiResponse<UserResponse> createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email đã được sử dụng");
        }
        if (request.phone() != null && userRepository.existsByPhone(request.phone())) {
            throw new DuplicateResourceException("Số điện thoại đã được sử dụng");
        }

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .avatar(request.avatar())
                .city(request.city())
                .district(request.district())
                .ward(request.ward())
                .address(request.address())
                .build();

        return ApiResponse.success("Tạo người dùng thành công", userMapper.toResponse(userRepository.save(user)));
    }

    @Override
    public ApiResponse<UserResponse> getUserById(Integer id) {
        UserResponse response = userRepository.findById(id.longValue())
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
        return ApiResponse.success("Lấy thông tin người dùng thành công", response);
    }

    @Override
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
        return ApiResponse.success("Lấy danh sách người dùng thành công", users);
    }

    @Override
    @Transactional
    public ApiResponse<UserResponse> updateUser(Integer id, UserRequest request) {
        User user = userRepository.findById(id.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email đã được sử dụng");
        }

        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone());
        user.setAvatar(request.avatar());
        user.setCity(request.city());
        user.setDistrict(request.district());
        user.setWard(request.ward());
        user.setAddress(request.address());

        return ApiResponse.success("Cập nhật người dùng thành công", userMapper.toResponse(userRepository.save(user)));
    }

    @Override
    @Transactional
    public ApiResponse<UserResponse> patchUser(Integer id, Map<String, Object> updates) {
        User user = userRepository.findById(id.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

        try {
            updates.remove("id");
            updates.remove("createdAt");
            updates.remove("updatedAt");
            updates.remove("role");

            if (updates.containsKey("password")) {
                updates.put("password", passwordEncoder.encode((String) updates.get("password")));
            }

            objectMapper.updateValue(user, updates);

            return ApiResponse.success("Cập nhật từng phần thành công",
                    userMapper.toResponse(userRepository.save(user)));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật từng phần: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<Void> deleteUser(Integer id) {
        if (!userRepository.existsById(id.longValue())) {
            throw new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id);
        }
        userRepository.deleteById(id.longValue());
        return ApiResponse.success("Xóa người dùng thành công", null);
    }

}
