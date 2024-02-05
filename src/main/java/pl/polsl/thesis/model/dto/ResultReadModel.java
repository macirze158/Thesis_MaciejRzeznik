package pl.polsl.thesis.model.dto;

import lombok.Data;

@Data
public class ResultReadModel {
    private Long resultId;

    private String pesel;

    private String patientFirstName;

    private String patientLastName;

    private UserReadModel userId;

    private ClientReadModel clientId;

    private String diagnosis;

    private Boolean signed;

    private String image;

    private String priority;
}
