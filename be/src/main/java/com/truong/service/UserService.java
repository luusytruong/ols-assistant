package com.truong.service;

import java.util.List;
import java.util.Map;

import com.truong.domain.dto.request.UserRequest;
import com.truong.domain.dto.response.ApiResponse;
import com.truong.domain.dto.response.UserResponse;

public interface UserService {
    ApiResponse<UserResponse> createUser(UserRequest request);

    ApiResponse<UserResponse> getUserById(Integer id);

    ApiResponse<List<UserResponse>> getAllUsers();

    ApiResponse<UserResponse> updateUser(Integer id, UserRequest request);

    ApiResponse<UserResponse> patchUser(Integer id, Map<String, Object> updates);

    ApiResponse<Void> deleteUser(Integer id);
}
