package pl.polsl.thesis.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "clients")
@Getter
@Setter
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id")
    private Long clientId;

    @NotBlank(message = "Client Name cannot be empty")
    @Column(name = "client_name")
    private String clientName;

    @Column(name = "city")
    private String city;

    @Column(name = "address")
    private String address;

    @Column(name = "nip")
    private String nip;

    @Column(name = "is_active")
    private Boolean active;

    @ManyToMany(mappedBy = "clients")
    @JsonBackReference
    private Set<User> users;

    @Column(name = "notification_users")
    private List<Long> notificationUsers;

    @Column(name = "permitted_users")
    private List<Long> permittedUsers;
}
