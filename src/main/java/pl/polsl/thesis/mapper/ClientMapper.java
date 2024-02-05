package pl.polsl.thesis.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import pl.polsl.thesis.model.dto.ClientReadModel;
import pl.polsl.thesis.model.dto.ClientWriteModel;
import pl.polsl.thesis.model.dto.UserReadModel;
import pl.polsl.thesis.model.entity.Client;
import pl.polsl.thesis.model.entity.User;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.WARN)
public interface ClientMapper {
    ClientMapper INSTANCE = Mappers.getMapper(ClientMapper.class);
    Client toEntity(ClientWriteModel clientWriteModel);

    ClientReadModel toReadModel(Client client);

    default Set<Long> mapUserIds(Set<User> users) {
        return users.stream()
                .map(User::getUserId)
                .collect(Collectors.toSet());
    }

    List<ClientReadModel> map(List<Client> clients);
}
