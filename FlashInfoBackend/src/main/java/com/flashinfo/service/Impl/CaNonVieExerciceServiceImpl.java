package com.flashinfo.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.flashinfo.dto.CaNonVieExerciceDto;
import com.flashinfo.mapper.CaNonVieExerciceMapper;
import com.flashinfo.repository.CaNonVieExerciceRepository;
import com.flashinfo.service.CaNonVieExerciceService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaNonVieExerciceServiceImpl implements CaNonVieExerciceService {
    private final CaNonVieExerciceRepository repository;
    private final CaNonVieExerciceMapper mapper;

    @Override
    public List<CaNonVieExerciceDto> getAllCaNonVieExercice() {
        List<Object[]> rows = repository.findAllCaNonVieExerciceNative();
        return rows.stream()
            .map(mapper::mapToDtoWithFormatting)
            .collect(Collectors.toList());
    }
}