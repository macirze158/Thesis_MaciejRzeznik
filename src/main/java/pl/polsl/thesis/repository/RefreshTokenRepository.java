package pl.polsl.thesis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.polsl.thesis.model.entity.RefreshToken;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);

    @Query(value = "SELECT * FROM refresh_token WHERE user_id = ?1", nativeQuery = true)
    Optional<RefreshToken> findRefreshTokenByUserId(Long userId);

}
