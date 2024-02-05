package pl.polsl.thesis.model.dto;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class ClientReadModel {
    private Long clientId;
    private String clientName;
    private String city;
    private String address;
    private String nip;
    private boolean active;
    private Set<Long> users;
    private List<Long> notificationUsers;
    private List<Long> permittedUsers;
}
