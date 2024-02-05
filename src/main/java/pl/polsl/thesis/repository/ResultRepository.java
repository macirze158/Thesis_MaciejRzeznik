package pl.polsl.thesis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.polsl.thesis.model.entity.Result;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    @Query(value = "SELECT * FROM results WHERE client_id = ?1", nativeQuery = true)
    Optional<List<Result>> findResultsByClient(Long clientId);
}
