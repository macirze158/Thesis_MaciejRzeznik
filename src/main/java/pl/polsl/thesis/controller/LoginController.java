package pl.polsl.thesis.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.polsl.thesis.model.dto.request.RefreshTokenRequest;
import pl.polsl.thesis.model.dto.request.SigninRequest;
import pl.polsl.thesis.model.dto.request.SignoutRequest;
import pl.polsl.thesis.model.dto.response.JwtAuthenticationResponse;
import pl.polsl.thesis.model.entity.RefreshToken;
import pl.polsl.thesis.service.AuthenticationService;
import pl.polsl.thesis.service.JwtService;
import pl.polsl.thesis.service.RefreshTokenService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class LoginController {

    private final AuthenticationService authenticationService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    @PostMapping("login")
    public ResponseEntity<?> signin(@RequestBody SigninRequest request) {
        return new ResponseEntity<>(authenticationService.signin(request), HttpStatus.OK);
    }

    @PostMapping("refreshToken")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return refreshTokenService.findByToken(refreshTokenRequest.getToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String jwtToken = jwtService.generateToken(user);
                    JwtAuthenticationResponse response = JwtAuthenticationResponse.builder().token(jwtToken).role(user.getUserRole().getRoleName()).signResults(user.getSignResults()).userId(user.getUserId()).build();
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }).orElseThrow(() -> new RuntimeException("Refresh token is not in the database"));
    }

    @PostMapping("logout")
    public ResponseEntity<?> signout(@RequestBody SignoutRequest signoutRequest) {
        return new ResponseEntity<>(authenticationService.signout(signoutRequest), HttpStatus.OK);
    }
}
