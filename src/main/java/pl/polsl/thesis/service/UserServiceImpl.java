package pl.polsl.thesis.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.polsl.thesis.model.dto.request.ChangePasswordRequest;
import pl.polsl.thesis.model.dto.request.DaysOffRequest;
import pl.polsl.thesis.errorHandling.UserConflictException;
import pl.polsl.thesis.mapper.UserMapper;
import pl.polsl.thesis.model.dto.UserReadModel;
import pl.polsl.thesis.model.dto.UserWriteModel;
import pl.polsl.thesis.model.entity.Client;
import pl.polsl.thesis.model.entity.User;
import pl.polsl.thesis.model.entity.UserRole;
import pl.polsl.thesis.repository.UserRepository;
import pl.polsl.thesis.repository.UserRoleRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder encoder;

    public UserServiceImpl(UserRepository userRepository, UserRoleRepository userRoleRepository, UserMapper userMapper, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.userMapper = userMapper;
        this.encoder = encoder;
    }

    @Override
    public UserReadModel addUser(UserWriteModel userWriteModel){
        List<UserReadModel> existingUsers = getAllUsers();
        boolean exists = existingUsers.stream().anyMatch(user -> user.getEmail().equals(userWriteModel.getEmail()));
        if (exists) {
            throw new UserConflictException(userWriteModel.getEmail());
        }
        User user = userMapper.toEntity(userWriteModel);
        user.setClients(new HashSet<>());
        user.setPassword(encoder.encode(userWriteModel.getPassword()));
        Optional<UserRole> role = userRoleRepository.findUserRoleByRoleName(userWriteModel.getRole());
        role.ifPresent(user::setUserRole);
        return userMapper.toReadModel(userRepository.save(user));
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId).get();
        user.setPassword(encoder.encode(request.getPassword()));
        userRepository.save(user);
    }

    @Override
    public List<UserReadModel> getAllUsers() {
        return userMapper.map(userRepository.findAll());
    }

    @Override
    public UserDetailsService userDetailsService() {
        return new UserDetailsService(){
            @Override
            public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
                Optional<User> user = userRepository.findUserByEmail(email);

                if (user.isEmpty()) {
                    throw new UsernameNotFoundException("User with email: %s not found".formatted(email)); //TODO Change exception type or handle exception
                }

                return user.get();
            }
        };
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public void toggleActive(Long userId) {
        User user = userRepository.findById(userId).get();
        if(user.getActive()) {
            user.setActive(false);
        } else {
            user.setActive(true);
        }
        userRepository.save(user);
    }

    @Override
    public List<UserReadModel> getUsersByClientId(Long clientId) {
        Client client = new Client();
        client.setClientId(clientId);
        return userMapper.map(userRepository.findByClients(client));
    }

    @Override
    public UserReadModel getUserById(Long userId) {
        return userMapper.toReadModel(userRepository.findById(userId).get());
    }

    @Override
    public void updateDaysOff(Long userId, DaysOffRequest request) {
        User user = userRepository.findById(userId).get();
        user.setDaysOffFrom(request.getFrom());
        user.setDaysOffTo(request.getTo());
        userRepository.save(user);
    }
}
