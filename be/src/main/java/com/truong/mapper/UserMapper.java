package com.truong.mapper;

import com.truong.domain.dto.response.UserResponse;
import com.truong.domain.entity.User;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}

//@Component
//public class UserMapper {
//
//    public UserResponse toResponse(User user) {
//        return new UserResponse(
//                user.getId(),
//                user.getFullName(),
//                user.getEmail(),
//                user.getPhone(),
//                user.getAvatar(),
//                user.getCity(),
//                user.getDistrict(),
//                user.getWard(),
//                user.getAddress(),
//                user.getRole().name()
//        );
//    }
//}
