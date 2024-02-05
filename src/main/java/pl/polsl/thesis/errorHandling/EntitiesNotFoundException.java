package pl.polsl.thesis.errorHandling;

public class EntitiesNotFoundException extends RuntimeException {
    public EntitiesNotFoundException(String message) {
        super(message);
    }
}
