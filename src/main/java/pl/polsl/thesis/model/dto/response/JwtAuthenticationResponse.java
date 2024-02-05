package pl.polsl.thesis.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String role;
    private String token;
    private String refreshToken;
    private Boolean signResults;
    private Long userId;
}