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
    
    @JsonProperty("ca_du_jour")
    private String caDuJour;
    
    @JsonProperty("ca_mois_actuel")
    private String caMoisActuel;
    
    @JsonProperty("ca_mois_annee_precedente")
    private String caMoisAnneePrecedente;
    
    @JsonProperty("taux_remplissage")
    private String tauxRemplissage;
    
    @JsonProperty("ytd_ca")
    private String ytdCa;
    
    @JsonProperty("ytd_evolution")
    private String ytdEvolution;
    
    @JsonProperty("ca_mois_precedent")
    private String caMoisPrecedent;
    
    @JsonProperty("evolution_mois_precedent")
    private String evolutionMoisPrecedent;
    
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