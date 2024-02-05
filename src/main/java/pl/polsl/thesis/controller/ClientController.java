    package pl.polsl.thesis.controller;

    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import pl.polsl.thesis.model.dto.request.AssignUserRequest;
    import pl.polsl.thesis.model.dto.ClientReadModel;
    import pl.polsl.thesis.model.dto.ClientWriteModel;
    import pl.polsl.thesis.model.entity.Client;
    import pl.polsl.thesis.service.ClientService;

    import java.util.List;

    @RestController
    @CrossOrigin(origins = {"http://localhost:3000"})
    @RequestMapping("/client")
    public class ClientController {

        private final ClientService clientService;

        public ClientController(ClientService clientService) {
            this.clientService = clientService;
        }

        @PostMapping()
        public ResponseEntity<?> addClient(@RequestBody ClientWriteModel clientWriteModel) {
            Client client = clientService.addClient(clientWriteModel);
            return new ResponseEntity<>(client, HttpStatus.CREATED);
        }

        @PostMapping("/assign")
        public ResponseEntity<?> assignUser(@RequestBody AssignUserRequest request) {
            clientService.assignUser(request); //TODO Add error handling
            return new ResponseEntity<>(null, HttpStatus.OK);
        }

        @DeleteMapping("/unassign")
        public ResponseEntity<?> unassignUser(@RequestBody AssignUserRequest request) {
            clientService.unassignUser(request); //TODO Add error handling
            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
        }

        @GetMapping()
        public ResponseEntity<List<ClientReadModel>> gerAllClients() {
            List<ClientReadModel> clients = clientService.getAllClients();
            return new ResponseEntity<>(clients, HttpStatus.OK);
        }

        @GetMapping("/active")
        public ResponseEntity<List<ClientReadModel>> gerActiveClients() {
            List<ClientReadModel> clients = clientService.getActiveClients();
            return new ResponseEntity<>(clients, HttpStatus.OK);
        }

        @GetMapping("/{clientId}")
        public ResponseEntity<ClientReadModel> getClient(@PathVariable Long clientId) {
            ClientReadModel client = clientService.getClientById(clientId);
            return new ResponseEntity<>(client, HttpStatus.OK);
        }

        @DeleteMapping("/{clientId}")
        public ResponseEntity<?> deleteClient(@PathVariable Long clientId) {
            clientService.deactivateClient(clientId);
            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
        }

        @PutMapping("/{clientId}")
        public ResponseEntity<?> updateClient(@RequestBody ClientWriteModel clientWriteModel, @PathVariable Long clientId) {
            Client client = clientService.updateClient(clientWriteModel, clientId);
            return new ResponseEntity<>(client, HttpStatus.OK);
        }

        @PutMapping("/{clientId}/notification-hierarchy")
        public ResponseEntity<?> updateNotificationHierarchy(@RequestBody ClientWriteModel clientWriteModel, @PathVariable Long clientId) {
            Client client = clientService.updateNotificationHierarchy(clientWriteModel, clientId);
            return new ResponseEntity<>(client, HttpStatus.OK);
        }

        @PutMapping("/{clientId}/permitted-users")
        public ResponseEntity<?> updatePermittedUsers(@RequestBody ClientWriteModel clientWriteModel, @PathVariable Long clientId) {
            Client client = clientService.updatePermittedUsers(clientWriteModel, clientId);
            return new ResponseEntity<>(client, HttpStatus.OK);
        }

        @GetMapping("/user/{userId}")
        public ResponseEntity<List<ClientReadModel>> getCLientsByUser(@PathVariable Long userId) {
            List<ClientReadModel> clients = clientService.getClientsByUser(userId);
            return new ResponseEntity<>(clients, HttpStatus.OK);
        }
    }
