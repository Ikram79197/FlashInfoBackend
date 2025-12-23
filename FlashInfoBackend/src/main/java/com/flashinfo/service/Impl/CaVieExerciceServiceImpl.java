package com.flashinfo.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.flashinfo.dto.CaVieExerciceDto;
import com.flashinfo.mapper.CaVieExerciceMapper;
import com.flashinfo.repository.CaVieExerciceRepository;
import com.flashinfo.service.CaVieExerciceService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaVieExerciceServiceImpl implements CaVieExerciceService {
    private final CaVieExerciceRepository repository;
    private final CaVieExerciceMapper mapper;

    @Override
    public List<CaVieExerciceDto> getAllCaVieExercice() {
        // Compute current and previous exercise years dynamically
        java.time.Year now = java.time.Year.now();
        String yearCurr = String.valueOf(now.getValue());
        String yearPrev = String.valueOf(now.minusYears(1).getValue());

        List<Object[]> rows = repository.findAllCaVieExerciceNative(yearPrev, yearCurr);
        return rows.stream()
                .map(mapper::mapToDtoWithFormatting)
                .collect(Collectors.toList());
    }
}
