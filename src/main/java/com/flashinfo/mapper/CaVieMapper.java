package com.flashinfo.mapper;

import com.flashinfo.dto.CaNonVieVieDto;
import com.flashinfo.entity.CaVie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CaVieMapper {
    
    @Mapping(target = "bu", expression = "java(entity.getMutuelle() + \" - \" + entity.getCodeBranche())")
    @Mapping(target = "auto", constant = "0")
    @Mapping(target = "at", constant = "0")
    @Mapping(target = "maladie", constant = "0")
    @Mapping(target = "divers", constant = "0")
    @Mapping(source = "montant", target = "vie", qualifiedByName = "roundToInteger")
    @Mapping(target = "total", constant = "0")
    CaNonVieVieDto toDto(CaVie entity);
    
    List<CaNonVieVieDto> toDtoList(List<CaVie> entities);
    
    @Named("roundToInteger")
    default BigDecimal roundToInteger(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        return value.setScale(0, RoundingMode.HALF_UP);
    }
}
