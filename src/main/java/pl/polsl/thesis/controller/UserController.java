package pl.polsl.thesis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.polsl.thesis.model.dto.request.ChangePasswordRequest;
import pl.polsl.thesis.model.dto.request.DaysOffRequest;
import pl.polsl.thesis.model.dto.request.UserDeleteRequest;
import pl.polsl.thesis.errorHandling.EntitiesNotFoundException;
import pl.polsl.thesis.model.dto.UserReadModel;
import pl.polsl.thesis.model.dto.UserWriteModel;
import pl.polsl.thesis.service.EmailService;
import pl.polsl.thesis.service.UserService;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    private final EmailService emailService;

    public UserController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping()
    public ResponseEntity<?> addUser(@RequestBody UserWriteModel userWriteModel) {
        UserReadModel user = userService.addUser(userWriteModel);
        try {
            emailService.sendAccountCreated(userWriteModel.getEmail(), userWriteModel.getPassword());
        } catch (Exception e) {
            userService.deleteUser(user.getUserId());
            return new ResponseEntity<>("Failed to send email", HttpStatus.SERVICE_UNAVAILABLE);
        }
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<UserReadModel>> getAllUsers() {
        List<UserReadModel> users = userService.getAllUsers();
        if(users.isEmpty())
            throw new EntitiesNotFoundException("No users in the database");
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteUser(@RequestBody UserDeleteRequest userDeleteRequest) {
        userService.deleteUser(userDeleteRequest.getUserId());
        return new ResponseEntity<>(null,HttpStatus.OK);
    }

    @PutMapping("/toggleActive/{userId}")
    public ResponseEntity<?> toggleActive(@PathVariable Long userId) {
        userService.toggleActive(userId);
        return new ResponseEntity<>(null,HttpStatus.OK);
    }

    @GetMapping("/assignedTo/{clientId}")
    public ResponseEntity<List<UserReadModel>> getUsersByClientId(@PathVariable Long clientId) {
        List<UserReadModel> users = userService.getUsersByClientId(clientId);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserReadModel> getUserById(@PathVariable Long userId) {
        UserReadModel user = userService.getUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/changePassword/{userId}")
    public ResponseEntity<?> changePassword(@PathVariable Long userId, @RequestBody ChangePasswordRequest requestBody) {
        userService.changePassword(userId, requestBody);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PutMapping("/changeDaysOff/{userId}")
    public ResponseEntity<?> changeDaysOff(@PathVariable Long userId, @RequestBody DaysOffRequest requestBody) {
        userService.updateDaysOff(userId, requestBody);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }
}
