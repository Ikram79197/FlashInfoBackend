package com.flashinfo.mapper;

import com.flashinfo.dto.CaNonVieVieDto;
import org.mapstruct.Mapper;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Mapper(componentModel = "spring")
public interface CaNonVieMapper {
    
    // Cette méthode n'est plus utilisée si tu n'as pas d'Entity
    // Tu peux la supprimer ou la garder pour d'autres usages
    
    @Named("roundToInteger")
    default BigDecimal roundToInteger(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        return value.setScale(0, RoundingMode.HALF_UP);
    }
}