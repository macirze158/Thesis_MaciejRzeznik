package pl.polsl.thesis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.polsl.thesis.mapper.ResultMapper;
import pl.polsl.thesis.model.dto.ResultReadModel;
import pl.polsl.thesis.model.dto.ResultWriteModel;
import pl.polsl.thesis.model.entity.Client;
import pl.polsl.thesis.model.entity.Result;
import pl.polsl.thesis.model.entity.User;
import pl.polsl.thesis.repository.ClientRepository;
import pl.polsl.thesis.repository.ResultRepository;
import pl.polsl.thesis.repository.UserRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ResultServiceImpl implements ResultService{
    private final ResultRepository resultRepository;

    private final ResultMapper resultMapper;
    private final UserRepository userRepository;

    @Autowired
    private final EmailService emailService;
    @Autowired
    private ClientRepository clientRepository;

    public ResultServiceImpl(ResultRepository resultRepository, ResultMapper resultMapper,
                             UserRepository userRepository, EmailService emailService) {
        this.resultRepository = resultRepository;
        this.resultMapper = resultMapper;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Override
    public List<ResultReadModel> getAllResults() {
        return resultMapper.map(resultRepository.findAll());
    }

    @Override
    public ResultReadModel getResult(Long resultId) {
        Result result = resultRepository.findById(resultId).isPresent() ? resultRepository.findById(resultId).get() : null;
        return resultMapper.toReadModel(result);
    }

    @Override
    public ResultReadModel addResult(ResultWriteModel resultWriteModel) {
        Result result = resultMapper.toEntity(resultWriteModel);
        return resultMapper.toReadModel(resultRepository.save(result));
    }

    @Override
    public ResultReadModel updateResult(Long resultId, ResultWriteModel resultWriteModel) {
        Result result = resultMapper.toEntity(resultWriteModel);
        result.setResultId(resultId);
        return resultMapper.toReadModel(resultRepository.save(result));
    }

    @Override
    public void signResult(Long resultId) {
        Result result = resultRepository.findById(resultId).get();
        User assignedUser = result.getUser();
        Client client = result.getClient();
        Instant currentTime = Instant.now();
        User sendTo = null;

        if(hasDaysOff(currentTime, assignedUser)) {
            for (Long u : client.getNotificationUsers()) {
                User _u = userRepository.findById(u).get();
                if(!hasDaysOff(currentTime, _u)) {
                    sendTo = _u;
                    break;
                }
            }
        } else {
            sendTo = assignedUser;
        }

        if(sendTo != null && Objects.equals(result.getPriority(), "cito")) {
            emailService.sendCitoResult(result.getPesel(), result.getPatientFirstName(), result.getPatientLastName(), resultId, sendTo.getEmail());
        }
        else if(sendTo != null && Objects.equals(result.getPriority(), "dilo")) {
            emailService.sendDiloResult(result.getPesel(), result.getPatientFirstName(), result.getPatientLastName(), resultId, sendTo.getEmail());
        }
        result.setSigned(true);
        resultRepository.save(result);
    }

    boolean hasDaysOff(Instant time, User user){
        if(user == null)
            return true;

        String from = user.getDaysOffFrom();
        String to = user.getDaysOffTo();

        Instant instantFrom;
        Instant instantTo;

        if(from != null && to != null) {
            LocalDate localDateFrom = LocalDate.parse(from);
            LocalDate localDateTo = LocalDate.parse(to);

            instantFrom = localDateFrom.atStartOfDay(ZoneId.systemDefault()).toInstant();
            instantTo = localDateTo.atStartOfDay(ZoneId.systemDefault()).toInstant();
        } else {
            return false;
        }

        return time.isAfter(instantFrom) && time.isBefore(instantTo);
    }

    @Override
    public List<ResultReadModel> getResultByClient(Long clientId) {
        List<ResultReadModel> results = resultMapper.map(resultRepository.findResultsByClient(clientId).get());
        return results.stream().filter(ResultReadModel::getSigned).collect(Collectors.toList());
    }
}
