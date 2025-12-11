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
    
    @JsonProperty("at")
    private String at;
    
    @JsonProperty("maladie")
    private String maladie;
    
    @JsonProperty("divers")
    private String divers;
    
    @JsonProperty("total")
    private String total;
    
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
