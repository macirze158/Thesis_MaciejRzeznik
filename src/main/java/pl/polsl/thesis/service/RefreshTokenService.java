package pl.polsl.thesis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.polsl.thesis.model.entity.RefreshToken;
import pl.polsl.thesis.repository.RefreshTokenRepository;
import pl.polsl.thesis.repository.UserRepository;

import javax.swing.text.html.Option;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    public RefreshToken createRefreshToken(String email){
        RefreshToken refreshToken = RefreshToken.builder()
                .user(userRepository.findUserByEmail(email).get())
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(3600000))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token){
        if(token.getExpiryDate().isBefore(Instant.now())){
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Token: %s expired".formatted(token.getToken()));
        }
        return token;
    }

    public void deleteRefreshTokenByUserId(Long id) {
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findRefreshTokenByUserId(id);
        refreshToken.ifPresent(token -> refreshTokenRepository.delete(token));
    }



}
