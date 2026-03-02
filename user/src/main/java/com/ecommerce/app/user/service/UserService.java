package com.ecommerce.app.user.service;

import com.ecommerce.app.user.dto.AddressDTO;
import com.ecommerce.app.user.dto.UserRequest;
import com.ecommerce.app.user.dto.UserResponse;
import com.ecommerce.app.user.model.Address;
import com.ecommerce.app.user.model.User;
import com.ecommerce.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
//    private final KeyCloakAdminService keyCloakAdminService;

    public List<UserResponse> fetchAllUsers(){
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

//    public void addUser(UserRequest userRequest){
//        String token = keyCloakAdminService.getAdminAccessToken();
//        String keycloakUserId =
//                keyCloakAdminService.createUser(token, userRequest);
//
//        User user = new User();
//        updateUserFromRequest(user, userRequest);
//        user.setKeycloakId(keycloakUserId);
//
//        keyCloakAdminService.assignRealmRoleToUser(userRequest.getUsername(),
//                "USER", keycloakUserId);
//        userRepository.save(user);
//    }

    public UserResponse findOrCreateUser(String keycloakId,
                                         String email,
                                         String firstName,
                                         String lastName) {

        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseGet(() -> {

                    User newUser = new User();
                    newUser.setKeycloakId(keycloakId);
                    newUser.setEmail(email);
                    newUser.setFirstName(firstName);
                    newUser.setLastName(lastName);

                    return userRepository.save(newUser);
                });

        return mapToUserResponse(user);
    }

    public Optional<UserResponse> fetchUser(Long id) {
        return userRepository.findById(id)
                .map(this::mapToUserResponse);
    }

//    public boolean updateUser(Long id, UserRequest updatedUserRequest) {
//        return userRepository.findById(id)
//                .map(existingUser -> {
//                    updateUserFromRequest(existingUser, updatedUserRequest);
//                    userRepository.save(existingUser);
//                    return true;
//                }).orElse(false);
//    }

    public Optional<UserResponse> updateUserAndReturn(
            Long id,
            UserRequest updatedUserRequest) {

        return userRepository.findById(id)
                .map(existingUser -> {

                    // update fields
                    updateUserFromRequest(existingUser, updatedUserRequest);

                    // save updated entity
                    User savedUser = userRepository.save(existingUser);

                    // convert to DTO
                    return mapToUserResponse(savedUser);
                });
    }

    private void updateUserFromRequest(User user, UserRequest userRequest) {
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        if (userRequest.getAddress() != null) {
            Address address = new Address();
            address.setStreet(userRequest.getAddress().getStreet());
            address.setState(userRequest.getAddress().getState());
            address.setZipcode(userRequest.getAddress().getZipcode());
            address.setCity(userRequest.getAddress().getCity());
            address.setCountry(userRequest.getAddress().getCountry());
            user.setAddress(address);
        }
    }

    private UserResponse mapToUserResponse(User user){
        UserResponse response = new UserResponse();
        response.setId(String.valueOf(user.getId()));
        response.setFirstName(user.getFirstName());
        response.setKeyCloakId(user.getKeycloakId());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());

        if (user.getAddress() != null) {
            AddressDTO addressDTO = new AddressDTO();
            addressDTO.setStreet(user.getAddress().getStreet());
            addressDTO.setCity(user.getAddress().getCity());
            addressDTO.setState(user.getAddress().getState());
            addressDTO.setCountry(user.getAddress().getCountry());
            addressDTO.setZipcode(user.getAddress().getZipcode());
            response.setAddress(addressDTO);
        }
        return response;
    }
}
