package com.flashinfo.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChiffreAffairesDto {
    
    private Long id;
    
    private String key;
    
    private String type;
    
    @JsonProperty("ca_25_11_2025")
    private String ca25112025;
    
    @JsonProperty("ca_nov_2025")
    private String caNov2025;
    
    @JsonProperty("ca_nov_2024")
    private String caNov2024;
    
    @JsonProperty("taux_remplissage")
    private String tauxRemplissage;
    
    @JsonProperty("ytd_ca")
    private String ytdCa;
    
    @JsonProperty("ytd_evolution")
    private String ytdEvolution;
    
    @JsonProperty("ca_oct_2025")
    private String caOct2025;
    
    @JsonProperty("evolution_oct_2025")
    private String evolutionOct2025;
    
    // Méthodes utilitaires pour la conversion des nombres
    public static String formatCurrency(BigDecimal amount) {
        if (amount == null) return "0,00";
        return String.format("%,.2f", amount)
            .replace(',', ' ')
            .replace('.', ',');
    }
    
    public static String formatPercentage(BigDecimal percentage) {
        if (percentage == null) return "0,00 %";
        return String.format("%.2f %%", percentage)
            .replace('.', ',');
    }
}