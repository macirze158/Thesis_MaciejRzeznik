package pl.polsl.thesis.model.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user_roles")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "role_id")
    private Long roleId;

    @NotBlank(message = "Role must not be blank")
    @Column(name = "role", unique = true)
    private String roleName;

    @OneToMany
    @ToString.Exclude
    @JsonManagedReference
    private Set<User> users = new HashSet<>();
}