package com.flashinfo.mapper;

import com.flashinfo.dto.CaMensuelNonVieDto;
import com.flashinfo.dto.CaMensuelVieDto;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Mapper(componentModel = "spring")
@Component
public interface CaMensuelMapper {

    CaMensuelMapper INSTANCE = Mappers.getMapper(CaMensuelMapper.class);

    // Mapper pour Non-Vie
    default CaMensuelNonVieDto objectArrayToDtoNonVie(Object[] row) {
        if (row == null || row.length < 9) {
            return null;
        }

        String bu = (String) row[0];
        BigDecimal auto = (BigDecimal) row[1];
        BigDecimal objAuto = (BigDecimal) row[2];
        BigDecimal at = (BigDecimal) row[3];
        BigDecimal objAt = (BigDecimal) row[4];
        BigDecimal maladie = (BigDecimal) row[5];
        BigDecimal objMaladie = (BigDecimal) row[6];
        BigDecimal divers = (BigDecimal) row[7];
        BigDecimal objDivers = (BigDecimal) row[8];

        // Créer le DTO
        CaMensuelNonVieDto dto = new CaMensuelNonVieDto();
        dto.setBu(bu);
        dto.setAuto(formatAmount(auto));
        dto.setAt(formatAmount(at));
        dto.setMaladie(formatAmount(maladie));
        dto.setDivers(formatAmount(divers));
        
        // Calculer et formater le total
        BigDecimal total = (auto != null ? auto : BigDecimal.ZERO)
            .add(at != null ? at : BigDecimal.ZERO)
            .add(maladie != null ? maladie : BigDecimal.ZERO)
            .add(divers != null ? divers : BigDecimal.ZERO);
        dto.setTotal(formatAmount(total));

        // Calculer les taux de remplissage
        BigDecimal tauxAuto = calculateTaux(auto, objAuto);
        BigDecimal tauxAt = calculateTaux(at, objAt);
        BigDecimal tauxMaladie = calculateTaux(maladie, objMaladie);
        BigDecimal tauxDivers = calculateTaux(divers, objDivers);
        
        BigDecimal objTotal = (objAuto != null ? objAuto : BigDecimal.ZERO)
            .add(objAt != null ? objAt : BigDecimal.ZERO)
            .add(objMaladie != null ? objMaladie : BigDecimal.ZERO)
            .add(objDivers != null ? objDivers : BigDecimal.ZERO);
        BigDecimal tauxTotal = calculateTaux(total, objTotal);

        dto.setTauxRemplissageAuto(formatTaux(tauxAuto));
        dto.setTauxRemplissageAt(formatTaux(tauxAt));
        dto.setTauxRemplissageMaladie(formatTaux(tauxMaladie));
        dto.setTauxRemplissageDivers(formatTaux(tauxDivers));
        dto.setTauxRemplissageTotal(formatTaux(tauxTotal));

        return dto;
    }

    // Mapper list pour Non-Vie
    default List<CaMensuelNonVieDto> objectArrayListToDtoListNonVie(List<Object[]> rows) {
        if (rows == null || rows.isEmpty()) {
            return new ArrayList<>();
        }

        // Calculer les totaux
        BigDecimal totalAuto = BigDecimal.ZERO;
        BigDecimal totalAt = BigDecimal.ZERO;
        BigDecimal totalMaladie = BigDecimal.ZERO;
        BigDecimal totalDivers = BigDecimal.ZERO;

        BigDecimal totalObjAuto = BigDecimal.ZERO;
        BigDecimal totalObjAt = BigDecimal.ZERO;
        BigDecimal totalObjMaladie = BigDecimal.ZERO;
        BigDecimal totalObjDivers = BigDecimal.ZERO;

        List<CaMensuelNonVieDto> dtoList = new ArrayList<>();

        for (Object[] row : rows) {
            CaMensuelNonVieDto dto = objectArrayToDtoNonVie(row);
            
            if (dto != null) {
                // Accumuler les totaux
                BigDecimal auto = (BigDecimal) row[1];
                BigDecimal objAuto = (BigDecimal) row[2];
                BigDecimal at = (BigDecimal) row[3];
                BigDecimal objAt = (BigDecimal) row[4];
                BigDecimal maladie = (BigDecimal) row[5];
                BigDecimal objMaladie = (BigDecimal) row[6];
                BigDecimal divers = (BigDecimal) row[7];
                BigDecimal objDivers = (BigDecimal) row[8];

                totalAuto = totalAuto.add(auto != null ? auto : BigDecimal.ZERO);
                totalAt = totalAt.add(at != null ? at : BigDecimal.ZERO);
                totalMaladie = totalMaladie.add(maladie != null ? maladie : BigDecimal.ZERO);
                totalDivers = totalDivers.add(divers != null ? divers : BigDecimal.ZERO);

                totalObjAuto = totalObjAuto.add(objAuto != null ? objAuto : BigDecimal.ZERO);
                totalObjAt = totalObjAt.add(objAt != null ? objAt : BigDecimal.ZERO);
                totalObjMaladie = totalObjMaladie.add(objMaladie != null ? objMaladie : BigDecimal.ZERO);
                totalObjDivers = totalObjDivers.add(objDivers != null ? objDivers : BigDecimal.ZERO);

                dtoList.add(dto);
            }
        }

        // Créer la ligne de total
        CaMensuelNonVieDto totalDto = new CaMensuelNonVieDto();
        totalDto.setBu("Total");
        totalDto.setAuto(formatAmount(totalAuto));
        totalDto.setAt(formatAmount(totalAt));
        totalDto.setMaladie(formatAmount(totalMaladie));
        totalDto.setDivers(formatAmount(totalDivers));
        
        BigDecimal grandTotal = totalAuto.add(totalAt).add(totalMaladie).add(totalDivers);
        totalDto.setTotal(formatAmount(grandTotal));

        BigDecimal tauxTotalAuto = calculateTaux(totalAuto, totalObjAuto);
        BigDecimal tauxTotalAt = calculateTaux(totalAt, totalObjAt);
        BigDecimal tauxTotalMaladie = calculateTaux(totalMaladie, totalObjMaladie);
        BigDecimal tauxTotalDivers = calculateTaux(totalDivers, totalObjDivers);

        BigDecimal grandObjTotal = totalObjAuto.add(totalObjAt).add(totalObjMaladie).add(totalObjDivers);
        BigDecimal tauxGrandTotal = calculateTaux(grandTotal, grandObjTotal);

        totalDto.setTauxRemplissageAuto(formatTaux(tauxTotalAuto));
        totalDto.setTauxRemplissageAt(formatTaux(tauxTotalAt));
        totalDto.setTauxRemplissageMaladie(formatTaux(tauxTotalMaladie));
        totalDto.setTauxRemplissageDivers(formatTaux(tauxTotalDivers));
        totalDto.setTauxRemplissageTotal(formatTaux(tauxGrandTotal));

        dtoList.add(totalDto);

        return dtoList;
    }

    // Mapper pour Vie
    default CaMensuelVieDto objectArrayToDtoVie(Object[] row) {
        if (row == null || row.length < 9) {
            return null;
        }

        String mutuelle = (String) row[0];
        BigDecimal capitalisation = (BigDecimal) row[1];
        BigDecimal tauxCapitalisation = (BigDecimal) row[2];
        BigDecimal retraite = (BigDecimal) row[3];
        BigDecimal tauxRetraite = (BigDecimal) row[4];
        BigDecimal deces = (BigDecimal) row[5];
        BigDecimal tauxDeces = (BigDecimal) row[6];
        BigDecimal total = (BigDecimal) row[7];
        BigDecimal tauxTotal = (BigDecimal) row[8];

        // Créer le DTO
        CaMensuelVieDto dto = new CaMensuelVieDto();
        dto.setMutuelle(mutuelle);
        dto.setCapitalisation(formatAmount(capitalisation));
        dto.setRetraite(formatAmount(retraite));
        dto.setDeces(formatAmount(deces));
        dto.setTotal(formatAmount(total));
        
        dto.setTauxRemplissageCapitalisation(formatTaux(tauxCapitalisation));
        dto.setTauxRemplissageRetraite(formatTaux(tauxRetraite));
        dto.setTauxRemplissageDeces(formatTaux(tauxDeces));
        dto.setTauxRemplissageTotal(formatTaux(tauxTotal));

        return dto;
    }

    // Mapper list pour Vie
    default List<CaMensuelVieDto> objectArrayListToDtoListVie(List<Object[]> rows) {
        if (rows == null || rows.isEmpty()) {
            return new ArrayList<>();
        }

        List<CaMensuelVieDto> dtoList = new ArrayList<>();

        for (Object[] row : rows) {
            CaMensuelVieDto dto = objectArrayToDtoVie(row);
            if (dto != null) {
                dtoList.add(dto);
            }
        }

        return dtoList;
    }

    // Méthodes utilitaires
    default BigDecimal calculateTaux(BigDecimal actual, BigDecimal objective) {
        if (objective == null || objective.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        if (actual == null) {
            return BigDecimal.ZERO;
        }
        return actual.multiply(BigDecimal.valueOf(100))
                .divide(objective, 2, RoundingMode.HALF_UP);
    }

    default String formatTaux(BigDecimal taux) {
        NumberFormat frenchFormat = NumberFormat.getInstance(Locale.FRANCE);
        frenchFormat.setMinimumFractionDigits(2);
        frenchFormat.setMaximumFractionDigits(2);
        return frenchFormat.format(taux) + " %";
    }

    default String formatAmount(BigDecimal amount) {
        if (amount == null) {
            return "0";
        }
        
        // Round to nearest integer
        long roundedAmount = Math.round(amount.doubleValue());
        boolean isNegative = roundedAmount < 0;
        long absAmount = Math.abs(roundedAmount);
        
        String formatted = String.valueOf(absAmount);
        
        // Add spaces as thousand separators
        StringBuilder result = new StringBuilder();
        int length = formatted.length();
        
        for (int i = 0; i < length; i++) {
            if (i > 0 && (length - i) % 3 == 0) {
                result.append(" ");
            }
            result.append(formatted.charAt(i));
        }
        
        // Add negative sign if needed
        if (isNegative && roundedAmount != 0) {
            result.insert(0, "-");
        }
        
        return result.toString();
    }
}