package pl.polsl.thesis.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserWriteModel {
    @NotBlank(message = "First name must not be blank")
    private String firstName;
    @NotBlank(message = "Last name must not be blank")
    private String lastName;
    @NotBlank(message = "Password must not be blank")
    private String password;
    @NotBlank(message = "Email must not be blank")
    private String email;
    private Boolean active;
    @NotBlank(message = "Role must not be blank")
    private String role;
    private String occupation;
    private String phoneNumber;
    private Boolean signResults;
    private Boolean changeNotificationHierarchy;
    private String title;
}
