package com.flashinfo.mapper;

import com.flashinfo.dto.CaVieExerciceDto;
import org.springframework.stereotype.Component;

import java.text.DecimalFormat;

@Component
public class CaVieExerciceMapper {

    public CaVieExerciceDto mapToDtoWithFormatting(Object[] row) {
        if (row == null || row.length < 13) {
            return CaVieExerciceDto.builder().build();
        }

        Double capCaCourante = safeToDouble(row[1]);
        Double capCaPrecedente = safeToDouble(row[2]);
        Double retCaCourante = safeToDouble(row[4]);
        Double retCaPrecedente = safeToDouble(row[5]);
        Double decCaCourante = safeToDouble(row[7]);
        Double decCaPrecedente = safeToDouble(row[8]);
        Double totalCaCourante = safeToDouble(row[10]);
        Double totalCaPrecedente = safeToDouble(row[11]);

        return CaVieExerciceDto.builder()
            .segment(safeToString(row[0]))
            .capCaCourante(capCaCourante)
            .capCaPrecedente(capCaPrecedente)
            .capTaux(safeToDouble(row[3]))
            .retCaCourante(retCaCourante)
            .retCaPrecedente(retCaPrecedente)
            .retTaux(safeToDouble(row[6]))
            .decCaCourante(decCaCourante)
            .decCaPrecedente(decCaPrecedente)
            .decTaux(safeToDouble(row[9]))
            .totalCaCourante(totalCaCourante)
            .totalCaPrecedente(totalCaPrecedente)
            .totalTaux(safeToDouble(row[12]))
            .formattedCapCaCourante(formatWithSpaces(capCaCourante))
            .formattedCapCaPrecedente(formatWithSpaces(capCaPrecedente))
            .formattedRetCaCourante(formatWithSpaces(retCaCourante))
            .formattedRetCaPrecedente(formatWithSpaces(retCaPrecedente))
            .formattedDecCaCourante(formatWithSpaces(decCaCourante))
            .formattedDecCaPrecedente(formatWithSpaces(decCaPrecedente))
            .formattedTotalCaCourante(formatWithSpaces(totalCaCourante))
            .formattedTotalCaPrecedente(formatWithSpaces(totalCaPrecedente))
            .build();
    }

    private String safeToString(Object value) {
        return value != null ? value.toString() : "";
    }

    private Double safeToDouble(Object value) {
        if (value == null) {
            return 0.0;
        }

        try {
            if (value instanceof Number) {
                return ((Number) value).doubleValue();
            } else if (value instanceof String) {
                String strValue = value.toString()
                        .replace(" ", "")
                        .replace(",", ".")
                        .replace("\u00A0", "");
                return Double.parseDouble(strValue);
            }
        } catch (Exception e) {
            return 0.0;
        }

        return 0.0;
    }

    public String formatWithSpaces(Double number) {
        if (number == null) {
            return "0";
        }
        long rounded = Math.round(number);
        DecimalFormat formatter = new DecimalFormat("#,###");
        String formatted = formatter.format(rounded);
        return formatted.replace(",", " ");
    }
}
