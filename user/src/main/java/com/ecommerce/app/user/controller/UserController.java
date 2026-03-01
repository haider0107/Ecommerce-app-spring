package com.ecommerce.app.user.controller;

import com.ecommerce.app.user.dto.UserRequest;
import com.ecommerce.app.user.dto.UserResponse;
import com.ecommerce.app.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        return new ResponseEntity<>(userService.fetchAllUsers(),
                HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
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

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String id){

        Long userId;

        try {
            userId = Long.parseLong(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }

        return userService.fetchUser(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

//    @PostMapping
//    public ResponseEntity<String> createUser(@RequestBody UserRequest userRequest){
//        userService.addUser(userRequest);
//        return ResponseEntity.ok("User added successfully");
//    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable String id,
                                             @RequestBody UserRequest updateUserRequest){
        Long userId;

        try {
            userId = Long.parseLong(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }

        boolean updated = userService.updateUser(userId, updateUserRequest);
        if (updated)
            return ResponseEntity.ok("User updated successfully");
        return ResponseEntity.notFound().build();
    }
}
