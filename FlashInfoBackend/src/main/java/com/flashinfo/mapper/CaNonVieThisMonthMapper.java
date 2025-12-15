package com.flashinfo.mapper;

import com.flashinfo.dto.CaNonVieThisMonthDto;
import org.springframework.stereotype.Component;

@Component
public class CaNonVieThisMonthMapper {
    public CaNonVieThisMonthDto mapToDto(Object[] row) {
        if (row == null || row.length < 16) {
            return CaNonVieThisMonthDto.builder().build();
        }
        return CaNonVieThisMonthDto.builder()
            .bu(row[0] != null ? row[0].toString() : null)
            .caAutoAnneeCourante(row[1] != null ? row[1].toString() : null)
            .caAutoAnneePrecedente(row[2] != null ? row[2].toString() : null)
            .tauxAuto(row[3] != null ? row[3].toString() : null)
            .caAtAnneeCourante(row[4] != null ? row[4].toString() : null)
            .caAtAnneePrecedente(row[5] != null ? row[5].toString() : null)
            .tauxAt(row[6] != null ? row[6].toString() : null)
            .caMaladieAnneeCourante(row[7] != null ? row[7].toString() : null)
            .caMaladieAnneePrecedente(row[8] != null ? row[8].toString() : null)
            .tauxMaladie(row[9] != null ? row[9].toString() : null)
            .caDiversAnneeCourante(row[10] != null ? row[10].toString() : null)
            .caDiversAnneePrecedente(row[11] != null ? row[11].toString() : null)
            .tauxDivers(row[12] != null ? row[12].toString() : null)
            .caTotalAnneeCourante(row[13] != null ? row[13].toString() : null)
            .caTotalAnneePrecedente(row[14] != null ? row[14].toString() : null)
            .tauxTotal(row[15] != null ? row[15].toString() : null)
            .build();
    }
}
