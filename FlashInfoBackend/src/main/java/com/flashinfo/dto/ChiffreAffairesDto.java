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
    private java.math.BigDecimal caDuJour;
    
    @JsonProperty("ca_mois_actuel")
    private java.math.BigDecimal caMoisActuel;
    
    @JsonProperty("ca_mois_annee_precedente")
    private java.math.BigDecimal caMoisAnneePrecedente;
    
    @JsonProperty("taux_remplissage")
    private java.math.BigDecimal tauxRemplissage;
    
    @JsonProperty("ytd_ca")
    private java.math.BigDecimal ytdCa;
    
    @JsonProperty("ytd_evolution")
    private java.math.BigDecimal ytdEvolution;
    
    @JsonProperty("ca_mois_precedent")
    private java.math.BigDecimal caMoisPrecedent;
    
    @JsonProperty("evolution_mois_precedent")
    private java.math.BigDecimal evolutionMoisPrecedent;
    
    // Note: numeric fields are returned as raw numbers (BigDecimal). If formatted strings are needed,
    // clients can format them as required. Formatting helpers were intentionally removed to return raw values.
}