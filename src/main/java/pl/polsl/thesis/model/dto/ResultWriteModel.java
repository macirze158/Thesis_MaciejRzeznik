package pl.polsl.thesis.model.dto;

import lombok.Data;

@Data
public class ResultWriteModel {
    private String pesel;

    private String patientFirstName;

    private String patientLastName;

    private String userId;

    private String clientId;

    private String diagnosis;

    private Boolean signed;

    private String image;

    private String priority;
}
