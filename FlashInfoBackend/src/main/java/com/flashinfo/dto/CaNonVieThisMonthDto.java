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
public class CaNonVieThisMonthDto {
    private String bu;

    @JsonProperty("ca_auto_annee_courante")
    private String caAutoAnneeCourante;

    @JsonProperty("ca_auto_annee_precedente")
    private String caAutoAnneePrecedente;

    @JsonProperty("taux_auto")
    private String tauxAuto;

    @JsonProperty("ca_at_annee_courante")
    private String caAtAnneeCourante;

    @JsonProperty("ca_at_annee_precedente")
    private String caAtAnneePrecedente;

    @JsonProperty("taux_at")
    private String tauxAt;

    @JsonProperty("ca_maladie_annee_courante")
    private String caMaladieAnneeCourante;

    @JsonProperty("ca_maladie_annee_precedente")
    private String caMaladieAnneePrecedente;

    @JsonProperty("taux_maladie")
    private String tauxMaladie;

    @JsonProperty("ca_divers_annee_courante")
    private String caDiversAnneeCourante;

    @JsonProperty("ca_divers_annee_precedente")
    private String caDiversAnneePrecedente;

    @JsonProperty("taux_divers")
    private String tauxDivers;

    @JsonProperty("ca_total_annee_courante")
    private String caTotalAnneeCourante;

    @JsonProperty("ca_total_annee_precedente")
    private String caTotalAnneePrecedente;

    @JsonProperty("taux_total")
    private String tauxTotal;

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
