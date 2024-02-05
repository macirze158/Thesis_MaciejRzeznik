package pl.polsl.thesis.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import pl.polsl.thesis.model.dto.request.ChangePasswordRequest;
import pl.polsl.thesis.model.dto.request.DaysOffRequest;
import pl.polsl.thesis.model.dto.UserReadModel;
import pl.polsl.thesis.model.dto.UserWriteModel;

import java.util.List;

public interface UserService {
    UserDetailsService userDetailsService();
    public UserReadModel addUser(UserWriteModel userWriteModel);
    public List<UserReadModel> getAllUsers();
    public void deleteUser(Long userId);
    public void toggleActive(Long userId);

    public List<UserReadModel> getUsersByClientId(Long clientId);

    public void changePassword(Long userId, ChangePasswordRequest request);
    public UserReadModel getUserById(Long userId);

    public void updateDaysOff(Long userId, DaysOffRequest request);
}
