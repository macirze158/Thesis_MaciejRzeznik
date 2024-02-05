package pl.polsl.thesis.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "results")
@Getter
@Setter
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "result_id")
    private Long resultId;

    @NotBlank(message = "PESEL must not be blank")
    @Column(name = "pesel")
    private String pesel;

    @Column(name = "patient_first_name")
    private String patientFirstName;

    @Column(name = "patient_last_name")
    private String patientLastName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @Column(name="diagnosis")
    private String diagnosis;

    @Column(name = "signed")
    private Boolean signed;

    @Column(name="image")
    private String image;

    @Column(name="priority")
    private String priority;
}
