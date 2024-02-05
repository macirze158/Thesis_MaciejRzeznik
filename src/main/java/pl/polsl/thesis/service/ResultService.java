package pl.polsl.thesis.service;

import pl.polsl.thesis.model.dto.ResultReadModel;
import pl.polsl.thesis.model.dto.ResultWriteModel;
import pl.polsl.thesis.model.entity.Result;

import java.util.List;

public interface ResultService {
    public List<ResultReadModel> getAllResults();

    public ResultReadModel getResult(Long resultId);

    public ResultReadModel addResult(ResultWriteModel result);

    public ResultReadModel updateResult(Long resultId, ResultWriteModel result);

    public void signResult(Long resultId);

    public List<ResultReadModel> getResultByClient(Long clientId);
}
