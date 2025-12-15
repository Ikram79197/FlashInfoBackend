package com.flashinfo.mapper;

import com.flashinfo.dto.CaNonVieExerciceDto;
import org.springframework.stereotype.Component;

import java.text.DecimalFormat;

@Component
public class CaNonVieExerciceMapper {

    public CaNonVieExerciceDto mapToDtoWithFormatting(Object[] row) {
        if (row == null || row.length < 16) {
            return CaNonVieExerciceDto.builder().build();
        }

        Double caAutoAnneeCourante = safeToDouble(row[1]);
        Double caAutoAnneePrecedente = safeToDouble(row[2]);
        Double caAtAnneeCourante = safeToDouble(row[4]);
        Double caAtAnneePrecedente = safeToDouble(row[5]);
        Double caMaladieAnneeCourante = safeToDouble(row[7]);
        Double caMaladieAnneePrecedente = safeToDouble(row[8]);
        Double caDiversAnneeCourante = safeToDouble(row[10]);
        Double caDiversAnneePrecedente = safeToDouble(row[11]);
        Double caTotalAnneeCourante = safeToDouble(row[13]);
        Double caTotalAnneePrecedente = safeToDouble(row[14]);

        return CaNonVieExerciceDto.builder()
            .bu(safeToString(row[0]))
            .caAutoAnneeCourante(caAutoAnneeCourante)
            .caAutoAnneePrecedente(caAutoAnneePrecedente)
            .tauxAuto(safeToDouble(row[3]))
            .caAtAnneeCourante(caAtAnneeCourante)
            .caAtAnneePrecedente(caAtAnneePrecedente)
            .tauxAt(safeToDouble(row[6]))
            .caMaladieAnneeCourante(caMaladieAnneeCourante)
            .caMaladieAnneePrecedente(caMaladieAnneePrecedente)
            .tauxMaladie(safeToDouble(row[9]))
            .caDiversAnneeCourante(caDiversAnneeCourante)
            .caDiversAnneePrecedente(caDiversAnneePrecedente)
            .tauxDivers(safeToDouble(row[12]))
            .caTotalAnneeCourante(caTotalAnneeCourante)
            .caTotalAnneePrecedente(caTotalAnneePrecedente)
            .tauxTotal(safeToDouble(row[15]))
            // Champs formatés
            .formattedCaAutoAnneeCourante(formatWithSpaces(caAutoAnneeCourante))
            .formattedCaAutoAnneePrecedente(formatWithSpaces(caAutoAnneePrecedente))
            .formattedCaAtAnneeCourante(formatWithSpaces(caAtAnneeCourante))
            .formattedCaAtAnneePrecedente(formatWithSpaces(caAtAnneePrecedente))
            .formattedCaMaladieAnneeCourante(formatWithSpaces(caMaladieAnneeCourante))
            .formattedCaMaladieAnneePrecedente(formatWithSpaces(caMaladieAnneePrecedente))
            .formattedCaDiversAnneeCourante(formatWithSpaces(caDiversAnneeCourante))
            .formattedCaDiversAnneePrecedente(formatWithSpaces(caDiversAnneePrecedente))
            .formattedCaTotalAnneeCourante(formatWithSpaces(caTotalAnneeCourante))
            .formattedCaTotalAnneePrecedente(formatWithSpaces(caTotalAnneePrecedente))
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
                    .replace(" ", ""); // espace insécable
                return Double.parseDouble(strValue);
            }
        } catch (Exception e) {
            // Log l'erreur si nécessaire
            return 0.0;
        }
        
        return 0.0;
    }
    
    // Méthode pour formater les nombres avec espaces (optionnel)
    public String formatWithSpaces(Double number) {
        if (number == null) {
            return "0";
        }
        
        // Arrondir à l'unité
        long rounded = Math.round(number);
        
        // Formater avec séparateur d'espace
        DecimalFormat formatter = new DecimalFormat("#,###");
        String formatted = formatter.format(rounded);
        
        // Remplacer la virgule par un espace (format français)
        return formatted.replace(",", " ");
    }
}