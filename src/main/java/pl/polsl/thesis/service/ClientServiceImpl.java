package pl.polsl.thesis.service;

import org.springframework.stereotype.Service;
import pl.polsl.thesis.model.dto.request.AssignUserRequest;
import pl.polsl.thesis.errorHandling.EntityConflictException;
import pl.polsl.thesis.mapper.ClientMapper;
import pl.polsl.thesis.model.dto.ClientReadModel;
import pl.polsl.thesis.model.dto.ClientWriteModel;
import pl.polsl.thesis.model.entity.Client;
import pl.polsl.thesis.model.entity.User;
import pl.polsl.thesis.repository.ClientRepository;
import pl.polsl.thesis.repository.UserRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ClientServiceImpl implements ClientService{

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final UserRepository userRepository;

    public ClientServiceImpl(ClientRepository clientRepository, ClientMapper clientMapper,
                             UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
        this.userRepository = userRepository;
    }

    @Override
    public Client addClient(ClientWriteModel clientWriteModel) {
        List<ClientReadModel> allClients = getAllClients();
        boolean exists = allClients.stream().anyMatch(client -> client.getClientName().equals(clientWriteModel.getClientName()));
        if(exists){
            throw new EntityConflictException("Client with given name already exists");
        }
        Client client = clientMapper.toEntity(clientWriteModel);
        return clientRepository.save(client);
    }

    @Override
    public void assignUser(AssignUserRequest request) {
        Client client = clientRepository.findById(request.getClientId()).get();
        User user = userRepository.findById(request.getUserId()).get();

        Set<User> assignedUsers = client.getUsers();
        assignedUsers.add(user);
        client.setUsers(assignedUsers);

        Set<Client> assignedClients = user.getClients();
        assignedClients.add(client);
        user.setClients(assignedClients);

        clientRepository.save(client);
        userRepository.save(user);
    }

    @Override
    public void unassignUser(AssignUserRequest request) {
        Client client = clientRepository.findById(request.getClientId()).get();
        User user = userRepository.findById(request.getUserId()).get();

        Set<User> assignedUsers = client.getUsers();
        assignedUsers.remove(user);
        client.setUsers(assignedUsers);

        Set<Client> assignedClients = user.getClients();
        assignedClients.remove(client);
        user.setClients(assignedClients);

        clientRepository.save(client);
        userRepository.save(user);
    }

    @Override
    public List<ClientReadModel> getAllClients() {
        return clientMapper.map(clientRepository.findAll());
    }

    @Override
    public List<ClientReadModel> getActiveClients() {
        List<ClientReadModel> allClients = clientMapper.map(clientRepository.findAll());
        return allClients.stream().filter(ClientReadModel::isActive).toList();
    }

    @Override
    public ClientReadModel getClientById(Long clientId) {
        return clientMapper.toReadModel(clientRepository.findById(clientId).get());
    }

    @Override
    public void deactivateClient(Long clientId) {
        Client client = clientRepository.findById(clientId).get();
        client.setActive(false);
        clientRepository.save(client);
    }

    @Override
    public Client updateClient(ClientWriteModel clientWriteModel, Long clientId) {
        Client client = clientRepository.findById(clientId).get();
        client.setCity(clientWriteModel.getCity());
        client.setAddress(clientWriteModel.getAddress());
        client.setNip(clientWriteModel.getNip());
        client.setNotificationUsers(clientWriteModel.getNotificationUsers());
        return clientRepository.save(client);
    }

    @Override
    public Client updateNotificationHierarchy(ClientWriteModel clientWriteModel, Long clientId) {
        Client client = clientRepository.findById(clientId).get();
        client.setNotificationUsers(clientWriteModel.getNotificationUsers());
        return clientRepository.save(client);
    }

    @Override
    public Client updatePermittedUsers(ClientWriteModel clientWriteModel, Long clientId) {
        Client client = clientRepository.findById(clientId).get();
        client.setPermittedUsers(clientWriteModel.getPermittedUsers());
        return clientRepository.save(client);
    }

    @Override
    public List<ClientReadModel> getClientsByUser(Long userId) {
        List<ClientReadModel> clients = clientMapper.map(clientRepository.findAll());
        return clients.stream().filter(client -> client.getUsers().contains(userId)).collect(Collectors.toList());
    }
}
