package com.flashinfo.service.Impl;

import com.flashinfo.dto.CaMensuelDto;
import com.flashinfo.repository.CaMensuelRepository;
import com.flashinfo.service.CaMensuelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaMensuelServiceImpl implements CaMensuelService {

    private final CaMensuelRepository caMensuelRepository;

    @Override
    public List<CaMensuelDto> getCaNonVieMensuel() {
        List<Object[]> results = caMensuelRepository.getCaNonVieMensuel();
        
        return results.stream().map(result -> {
            String bu = (String) result[0];
            BigDecimal auto = (BigDecimal) result[1];
            BigDecimal at = (BigDecimal) result[2];
            BigDecimal maladie = (BigDecimal) result[3];
            BigDecimal divers = (BigDecimal) result[4];
            
            return CaMensuelDto.createFromBuData(bu, auto, at, maladie, divers);
        }).collect(Collectors.toList());
    }

    @Override
    public List<CaMensuelDto> getCaVieMensuel() {
        List<Object[]> results = caMensuelRepository.getCaVieMensuel();
        
        return results.stream().map(result -> {
            String bu = (String) result[0];
            BigDecimal auto = (BigDecimal) result[1];
            BigDecimal at = (BigDecimal) result[2];
            BigDecimal maladie = (BigDecimal) result[3];
            BigDecimal divers = (BigDecimal) result[4];
            
            return CaMensuelDto.createFromBuData(bu, auto, at, maladie, divers);
        }).collect(Collectors.toList());
    }
}
