package pl.polsl.thesis.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ClientWriteModel {
    @NotBlank(message = "Client Name cannot be empty")
    private String clientName;
    private String city;
    private String address;
    private String nip;
    private Boolean active;
    private List<Long> notificationUsers;
    private List<Long> permittedUsers;
}
