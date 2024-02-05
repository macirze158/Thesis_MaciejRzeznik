package pl.polsl.thesis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.polsl.thesis.errorHandling.EntitiesNotFoundException;
import pl.polsl.thesis.model.dto.ResultReadModel;
import pl.polsl.thesis.model.dto.ResultWriteModel;
import pl.polsl.thesis.model.entity.Result;
import pl.polsl.thesis.service.ResultService;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/result")
public class ResultController {

    @Autowired
    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping
    public ResponseEntity<?> getAllResults() {
        List<ResultReadModel> results = resultService.getAllResults();
        if(results.isEmpty())
            throw new EntitiesNotFoundException("No results in the database");
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @GetMapping("/{resultId}")
    public ResponseEntity<?> getResultById(@PathVariable Long resultId) {
        ResultReadModel results = resultService.getResult(resultId);
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<?> addResult(@RequestBody ResultWriteModel result) {
        ResultReadModel _result = resultService.addResult(result);
        return new ResponseEntity<>(_result, HttpStatus.CREATED);
    }

    @PutMapping("/{resultId}")
    public ResponseEntity<?> updateResult(@PathVariable Long resultId, @RequestBody ResultWriteModel result) {
        ResultReadModel _result = resultService.updateResult(resultId, result);
        return new ResponseEntity<>(_result, HttpStatus.OK);
    }

    @PostMapping("/{resultId}/sign")
    public ResponseEntity<?> signResult(@PathVariable Long resultId) {
        resultService.signResult(resultId);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getResultsByClient(@PathVariable Long clientId) {
        List<ResultReadModel> results = resultService.getResultByClient(clientId);
        if(results.isEmpty())
            throw new EntitiesNotFoundException("No results in the database");
        return new ResponseEntity<>(results, HttpStatus.OK);
    }
}
