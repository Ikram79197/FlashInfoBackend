package com.flashinfo.mapper;

import com.flashinfo.dto.CaNonVieVieDto;
import com.flashinfo.entity.CaNonVie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CaNonVieMapper {
    
    @Mapping(source = "bu", target = "bu")
    @Mapping(source = "auto", target = "auto", qualifiedByName = "roundToInteger")
    @Mapping(source = "at", target = "at", qualifiedByName = "roundToInteger")
    @Mapping(source = "maladie", target = "maladie", qualifiedByName = "roundToInteger")
    @Mapping(source = "divers", target = "divers", qualifiedByName = "roundToInteger")
    @Mapping(target = "vie", constant = "0")
    @Mapping(source = "total", target = "total", qualifiedByName = "roundToInteger")
    CaNonVieVieDto toDto(CaNonVie entity);
    
    List<CaNonVieVieDto> toDtoList(List<CaNonVie> entities);
    
    @Named("roundToInteger")
    default BigDecimal roundToInteger(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        return value.setScale(0, RoundingMode.HALF_UP);
    }
}