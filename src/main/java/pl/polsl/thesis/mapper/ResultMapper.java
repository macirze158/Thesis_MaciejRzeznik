package pl.polsl.thesis.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import pl.polsl.thesis.model.dto.ResultReadModel;
import pl.polsl.thesis.model.dto.ResultWriteModel;
import pl.polsl.thesis.model.entity.Client;
import pl.polsl.thesis.model.entity.Result;
import pl.polsl.thesis.model.entity.User;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.WARN)
public interface ResultMapper {

    default User mapUser(String userId) {
        if (userId == null) {
            return null;
        }
        User user = new User();
        user.setUserId(Long.parseLong(userId));
        return user;
    }

    default String mapUser(User user) {
        return user != null ? String.valueOf(user.getUserId()) : null;
    }

    default Client mapClient(String clientId) {
        if (clientId == null) {
            return null;
        }
        Client client = new Client();
        client.setClientId(Long.parseLong(clientId));
        return client;
    }

    default String mapClient(Client client) {
        return client != null ? String.valueOf(client.getClientId()) : null;
    }
    @Mapping(target = "user", source = "userId")
    @Mapping(target = "client", source = "clientId")
    Result toEntity(ResultWriteModel resultWriteModel);

    @Mapping(target = "userId", source = "user")
    @Mapping(target = "clientId", source = "client")
    ResultWriteModel toWriteModel(Result result);

    @Mapping(target = "userId", source = "user")
    @Mapping(target = "clientId", source = "client")
    ResultReadModel toReadModel(Result result);

    List<ResultReadModel> map(List<Result> results);

}
