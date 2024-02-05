package pl.polsl.thesis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.polsl.thesis.model.entity.Client;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    @Query(value = "SELECT c FROM User u JOIN u.clients c WHERE u.userId = ?1", nativeQuery = true)
    Optional<List<Client>> findClientsByUser(Long userId);
}
