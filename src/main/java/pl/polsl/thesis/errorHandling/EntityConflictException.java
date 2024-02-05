package pl.polsl.thesis.errorHandling;

import org.springframework.dao.DataAccessException;

public class EntityConflictException extends DataAccessException {
    public EntityConflictException(String message) {super(message);}
}
