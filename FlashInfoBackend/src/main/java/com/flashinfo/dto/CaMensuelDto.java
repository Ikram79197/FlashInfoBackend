package com.flashinfo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaMensuelDto {
    
    @JsonProperty("bu")
    private String bu;
    
    @JsonProperty("auto")
    private String auto;
    
    @JsonProperty("tauxRemplissageAuto")
    private String tauxRemplissageAuto;
    
    @JsonProperty("at")
    private String at;
    
    @JsonProperty("tauxRemplissageAt")
    private String tauxRemplissageAt;
    
    @JsonProperty("maladie")
    private String maladie;
    
    @JsonProperty("tauxRemplissageMaladie")
    private String tauxRemplissageMaladie;
    
    @JsonProperty("divers")
    private String divers;
    
    @JsonProperty("tauxRemplissageDivers")
    private String tauxRemplissageDivers;
    
    @JsonProperty("total")
    private String total;
    
    @JsonProperty("tauxRemplissageTotal")
    private String tauxRemplissageTotal;
    
    // Factory method pour créer depuis les données BU
    public static CaMensuelDto createFromBuData(String bu, BigDecimal auto, BigDecimal at, 
                                               BigDecimal maladie, BigDecimal divers) {
        CaMensuelDto dto = new CaMensuelDto();
        dto.setBu(bu);
        dto.setAuto(formatAmount(auto));
        dto.setAt(formatAmount(at));
        dto.setMaladie(formatAmount(maladie));
        dto.setDivers(formatAmount(divers));
        dto.setTotal(dto.calculateTotal());
        return dto;
    }
    
    // Factory method avec taux de remplissage
    public static CaMensuelDto createFromBuDataWithTaux(String bu, BigDecimal auto, BigDecimal at, 
                                                        BigDecimal maladie, BigDecimal divers,
                                                        int currentDay, int totalDaysInMonth) {
        CaMensuelDto dto = new CaMensuelDto();
        dto.setBu(bu);
        dto.setAuto(formatAmount(auto));
        dto.setAt(formatAmount(at));
        dto.setMaladie(formatAmount(maladie));
        dto.setDivers(formatAmount(divers));
        dto.setTotal(dto.calculateTotal());
        
        // Calculer les taux de remplissage
        dto.setTauxRemplissageAuto(calculateTauxRemplissage(auto, currentDay, totalDaysInMonth));
        dto.setTauxRemplissageAt(calculateTauxRemplissage(at, currentDay, totalDaysInMonth));
        dto.setTauxRemplissageMaladie(calculateTauxRemplissage(maladie, currentDay, totalDaysInMonth));
        dto.setTauxRemplissageDivers(calculateTauxRemplissage(divers, currentDay, totalDaysInMonth));
        
        BigDecimal total = auto.add(at).add(maladie).add(divers);
        dto.setTauxRemplissageTotal(calculateTauxRemplissage(total, currentDay, totalDaysInMonth));
        
        return dto;
    }
    
    private static String calculateTauxRemplissage(BigDecimal montant, int currentDay, int totalDaysInMonth) {
        if (montant == null || montant.compareTo(BigDecimal.ZERO) == 0) {
            return "0,00 %";
        }
        
        // Taux = (CA actuel / Jours écoulés) × Jours totaux du mois / CA actuel × 100
        // Simplifié: Taux = (Jours écoulés / Jours totaux) × 100
        // Pour avoir le taux de remplissage par rapport à l'objectif mensuel estimé
        double tauxJournalier = montant.doubleValue() / currentDay;
        double objectifMensuel = tauxJournalier * totalDaysInMonth;
        double taux = (montant.doubleValue() / objectifMensuel) * 100;
        
        return String.format("%.2f %%", taux).replace('.', ',');
    }
    
    public static String formatAmount(BigDecimal amount) {
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
    
    private String calculateTotal() {
        try {
            long autoVal = parseCurrency(this.auto);
            long atVal = parseCurrency(this.at);
            long maladieVal = parseCurrency(this.maladie);
            long diversVal = parseCurrency(this.divers);
            
            long total = autoVal + atVal + maladieVal + diversVal;
            return formatAmount(new BigDecimal(total));
        } catch (Exception e) {
            return "0";
        }
    }
    
    private long parseCurrency(String value) {
        if (value == null || value.trim().isEmpty()) {
            return 0L;
        }
        try {
            // Check if negative
            boolean isNegative = value.trim().startsWith("-");
            
            // Remove all separators and negative sign
            String cleaned = value.replaceAll("[.,\\s-]", "");
            
            if (cleaned.isEmpty()) {
                return 0L;
            }
            
            long result = Long.parseLong(cleaned);
            return isNegative ? -result : result;
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
}
