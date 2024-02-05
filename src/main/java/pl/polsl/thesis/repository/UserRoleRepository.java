package pl.polsl.thesis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.polsl.thesis.model.entity.UserRole;

import java.util.Optional;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

    Optional<UserRole> findUserRoleByRoleName(String roleName);

    UserRole findUserRoleEntityByRoleName(String roleName);

}
