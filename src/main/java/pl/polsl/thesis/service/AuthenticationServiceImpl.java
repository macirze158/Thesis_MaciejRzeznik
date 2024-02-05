package pl.polsl.thesis.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import pl.polsl.thesis.model.dto.request.SigninRequest;
import pl.polsl.thesis.model.dto.request.SignoutRequest;
import pl.polsl.thesis.model.dto.response.JwtAuthenticationResponse;
import pl.polsl.thesis.errorHandling.EntitiesNotFoundException;
import pl.polsl.thesis.model.entity.RefreshToken;
import pl.polsl.thesis.repository.RefreshTokenRepository;
import pl.polsl.thesis.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements  AuthenticationService{

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public JwtAuthenticationResponse signin(SigninRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())); //TODO Add exception handling
        var user = userRepository.findUserByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        var jwt = jwtService.generateToken(user);
        refreshTokenService.deleteRefreshTokenByUserId(userRepository.findUserByEmail(request.getEmail()).get().getUserId());
        var refreshToken = refreshTokenService.createRefreshToken(request.getEmail());
        return JwtAuthenticationResponse.builder().role(user.getUserRole().getRoleName()).token(jwt).refreshToken(refreshToken.getToken()).signResults(user.getSignResults()).userId(user.getUserId()).build();
    }

    @Override
    public String signout(SignoutRequest request) {
        RefreshToken token = refreshTokenService.findByToken(request.getRefreshToken()).isPresent() ? refreshTokenService.findByToken(request.getRefreshToken()).get() : null;
        if (token != null) {
            refreshTokenRepository.delete(token);
        } else {
            throw new EntitiesNotFoundException("Refresh Token not found");
        }
        return token.getToken();
    }
}
