package pl.polsl.thesis.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignUserRequest {
    private Long userId;
    private Long clientId;
}
