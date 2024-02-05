package pl.polsl.thesis.service;

import pl.polsl.thesis.model.dto.request.AssignUserRequest;
import pl.polsl.thesis.model.dto.ClientReadModel;
import pl.polsl.thesis.model.dto.ClientWriteModel;
import pl.polsl.thesis.model.entity.Client;

import java.util.List;

public interface ClientService {
    public Client addClient(ClientWriteModel clientWriteModel);
    public void assignUser(AssignUserRequest request);
    public void unassignUser(AssignUserRequest request);

    public List<ClientReadModel> getAllClients();
    public List<ClientReadModel> getActiveClients();

    public ClientReadModel getClientById(Long clientId);

    public void deactivateClient(Long clientId);

    public Client updateClient(ClientWriteModel clientWriteModel, Long clientId);
    public Client updateNotificationHierarchy(ClientWriteModel clientWriteModel, Long clientId);
    public Client updatePermittedUsers(ClientWriteModel clientWriteModel, Long clientId);

    public List<ClientReadModel> getClientsByUser(Long userId);
}
