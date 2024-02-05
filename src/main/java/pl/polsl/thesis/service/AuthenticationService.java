package pl.polsl.thesis.service;

import pl.polsl.thesis.model.dto.request.SigninRequest;
import pl.polsl.thesis.model.dto.request.SignoutRequest;
import pl.polsl.thesis.model.dto.response.JwtAuthenticationResponse;

public interface AuthenticationService {
    JwtAuthenticationResponse signin(SigninRequest request);
    String signout(SignoutRequest request);
}
