package com.ecommerce.app.user.controller;

import com.ecommerce.app.user.dto.ApiResponse;
import com.ecommerce.app.user.dto.UserRequest;
import com.ecommerce.app.user.dto.UserResponse;
import com.ecommerce.app.user.exception.ResourceNotFoundException;
import com.ecommerce.app.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    // ✅ GET ALL USERS
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        List<UserResponse> users = userService.fetchAllUsers();

        return ResponseEntity.ok(
                ApiResponse.<List<UserResponse>>builder()
                        .success(true)
                        .status(200)
                        .message("Users fetched successfully")
                        .data(users)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    // ✅ GET CURRENT USER
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal Jwt jwt
//            Authentication authentication
    ) {

        // Raw token string
//        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
//            String rawToken = jwtAuth.getToken().getTokenValue();
//            System.out.println("Raw JWT Token: " + rawToken);
//        }

//        System.out.println("Decoded Claims: " + jwt.getClaims());

        String keycloakId = jwt.getSubject();
        String email = jwt.getClaim("email");
        String firstName = jwt.getClaim("given_name");
        String lastName = jwt.getClaim("family_name");

        UserResponse response = userService.findOrCreateUser(
                keycloakId,
                email,
                firstName,
                lastName
        );

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .status(200)
                        .message("Current user fetched successfully")
                        .data(response)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    // ✅ GET USER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable String id){

        return userService.fetchUser(Long.valueOf(id))
                .map(user -> ResponseEntity.ok(
                        ApiResponse.<UserResponse>builder()
                                .success(true)
                                .status(200)
                                .message("User fetched successfully")
                                .data(user)
                                .timestamp(LocalDateTime.now())
                                .build()
                ))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

//    @PostMapping
//    public ResponseEntity<String> createUser(@RequestBody UserRequest userRequest){
//        userService.addUser(userRequest);
//        return ResponseEntity.ok("User added successfully");
//    }

    // ✅ UPDATE USER
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable String id,
                                             @RequestBody UserRequest updateUserRequest){
        UserResponse updatedUser = userService.updateUserAndReturn(Long.valueOf(id), updateUserRequest)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .status(200)
                        .message("User updated successfully")
                        .data(updatedUser)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
}
