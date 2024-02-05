package pl.polsl.thesis.model.dto;

import lombok.Data;
import pl.polsl.thesis.model.entity.Client;

import java.util.Set;

@Data
public class UserReadModel {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private Boolean active;
    private String occupation;
    private String phoneNumber;
    private Boolean signResults;
    private Boolean changeNotificationHierarchy;
    private String title;
    private String daysOffFrom;
    private String daysOffTo;
    private Set<String> clients;

    public Boolean isActive(){
        if(active==null){
            return true;
        }
        return active;
    }
}
