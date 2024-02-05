package pl.polsl.thesis.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import pl.polsl.thesis.model.dto.UserReadModel;
import pl.polsl.thesis.model.dto.UserWriteModel;
import pl.polsl.thesis.model.entity.Client;
import pl.polsl.thesis.model.entity.User;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.WARN)
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    User toEntity(UserWriteModel userWriteModel);

    @Mapping(source = "userRole.roleName", target = "role")
    UserReadModel toReadModel(User user);

    default Set<String> mapClients(Set<Client> clients) {
        return clients.stream()
                .map(Client::getClientName)
                .collect(Collectors.toSet());
    }

    void updateUserFromDto(UserWriteModel userWriteModel, @MappingTarget User user);

    List<UserReadModel> map(List<User> users);
}
