package com.flashinfo.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.flashinfo.dto.CaNonVieThisMonthDto;
import com.flashinfo.mapper.CaNonVieThisMonthMapper;
import com.flashinfo.repository.CaNonVieThisMonthRepository;
import com.flashinfo.service.CaNonVieThisMonthService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaNonVieThisMonthServiceImpl implements CaNonVieThisMonthService {
    private final CaNonVieThisMonthRepository repository;
    private final CaNonVieThisMonthMapper mapper;

    @Override
    public List<CaNonVieThisMonthDto> getAllCaNonVieThisMonth() {
        List<Object[]> rows = repository.findAllCaNonVieThisMonthNative();
        return rows.stream().map(mapper::mapToDto).toList();
    }
}
