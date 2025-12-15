package com.flashinfo.service.Impl;

import com.flashinfo.dto.CaVieThisMonthDto;
import com.flashinfo.entity.CaVieThisMonth;
import com.flashinfo.mapper.CaVieThisMonthMapper;
import com.flashinfo.repository.CaVieThisMonthRepository;
import com.flashinfo.service.CaVieThisMonthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
public class CaVieThisMonthServiceImpl implements CaVieThisMonthService {

    @Autowired
    private CaVieThisMonthRepository repository;

    @Autowired
    private CaVieThisMonthMapper mapper;

    @Override
    public List<CaVieThisMonthDto> getAll() {
        List<Object[]> rows = repository.findAllCaVieThisMonthNative();
        return rows.stream().map(this::mapRowToDto).collect(Collectors.toList());
    }

    private CaVieThisMonthDto mapRowToDto(Object[] row) {
        CaVieThisMonthDto dto = new CaVieThisMonthDto();
        int i = 0;
        dto.setBu((String) row[i++]);
        dto.setCaCapitalisation(toBigDecimal(row[i++]));
        dto.setTauxCapitalisation(toDouble(row[i++]));
        dto.setCaRetr(toBigDecimal(row[i++]));
        dto.setTauxRetr(toDouble(row[i++]));
        dto.setCaDeces(toBigDecimal(row[i++]));
        dto.setTauxDeces(toDouble(row[i++]));
        dto.setCaTotal(toBigDecimal(row[i++]));
        dto.setTauxTotal(toDouble(row[i++]));
        return dto;
    }

    private BigDecimal toBigDecimal(Object o) {
        if (o == null) return null;
        if (o instanceof BigDecimal) return (BigDecimal) o;
        if (o instanceof Number) return BigDecimal.valueOf(((Number) o).doubleValue());
        return new BigDecimal(o.toString());
    }

    private Double toDouble(Object o) {
        if (o == null) return null;
        if (o instanceof Double) return (Double) o;
        if (o instanceof Number) return ((Number) o).doubleValue();
        return Double.valueOf(o.toString());
    }
}
