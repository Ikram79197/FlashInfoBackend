package com.flashinfo.service.Impl;

import com.flashinfo.dto.Emission500KDHSDto;
import com.flashinfo.mapper.Emission500KDHSMapper;
import com.flashinfo.repository.Emission500KDHSRepository;
import com.flashinfo.service.Emission500KDHSService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class Emission500KDHSServiceImpl implements Emission500KDHSService {

    private final Emission500KDHSRepository emission500KDHSRepository;
    private final Emission500KDHSMapper emission500KDHSMapper;

    @Override
    public List<Emission500KDHSDto> getEmissions500KDHS() {
        LocalDate dateComptable = LocalDate.now().minusDays(1);
        Integer exercice = LocalDate.now().getYear();

        List<Object[]> results = emission500KDHSRepository.findEmissions500KDHS(exercice, dateComptable);
        
        return emission500KDHSMapper.objectArrayListToDtoList(results);
    }
}
