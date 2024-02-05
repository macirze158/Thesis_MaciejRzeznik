package pl.polsl.thesis.errorHandling;

import org.springframework.dao.DataAccessException;

public class UserConflictException extends DataAccessException {
    public UserConflictException(String email) {
        super("User with email: %s already exists".formatted(email));
    }
}
