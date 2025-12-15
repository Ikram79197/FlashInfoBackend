package com.flashinfo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CaNonVieExerciceDto {
    // Données brutes
    private String bu;
    private Double caAutoAnneeCourante;
    private Double caAutoAnneePrecedente;
    private Double tauxAuto;
    private Double caAtAnneeCourante;
    private Double caAtAnneePrecedente;
    private Double tauxAt;
    private Double caMaladieAnneeCourante;
    private Double caMaladieAnneePrecedente;
    private Double tauxMaladie;
    private Double caDiversAnneeCourante;
    private Double caDiversAnneePrecedente;
    private Double tauxDivers;
    private Double caTotalAnneeCourante;
    private Double caTotalAnneePrecedente;
    private Double tauxTotal;
    
    // Données formatées (optionnel)
    @Builder.Default
    private String formattedCaAutoAnneeCourante = "";
    
    @Builder.Default
    private String formattedCaAutoAnneePrecedente = "";
    
    @Builder.Default
    private String formattedCaAtAnneeCourante = "";
    
    @Builder.Default
    private String formattedCaAtAnneePrecedente = "";
    
    @Builder.Default
    private String formattedCaMaladieAnneeCourante = "";
    
    @Builder.Default
    private String formattedCaMaladieAnneePrecedente = "";
    
    @Builder.Default
    private String formattedCaDiversAnneeCourante = "";
    
    @Builder.Default
    private String formattedCaDiversAnneePrecedente = "";
    
    @Builder.Default
    private String formattedCaTotalAnneeCourante = "";
    
    @Builder.Default
    private String formattedCaTotalAnneePrecedente = "";
    
    // Constructeur par défaut (nécessaire pour Builder)
    public CaNonVieExerciceDto() {
    }
    
    // Constructeur avec Builder
    public CaNonVieExerciceDto(String bu, Double caAutoAnneeCourante, Double caAutoAnneePrecedente, 
                              Double tauxAuto, Double caAtAnneeCourante, Double caAtAnneePrecedente, 
                              Double tauxAt, Double caMaladieAnneeCourante, Double caMaladieAnneePrecedente, 
                              Double tauxMaladie, Double caDiversAnneeCourante, Double caDiversAnneePrecedente, 
                              Double tauxDivers, Double caTotalAnneeCourante, Double caTotalAnneePrecedente, 
                              Double tauxTotal, String formattedCaAutoAnneeCourante, 
                              String formattedCaAutoAnneePrecedente, String formattedCaAtAnneeCourante, 
                              String formattedCaAtAnneePrecedente, String formattedCaMaladieAnneeCourante, 
                              String formattedCaMaladieAnneePrecedente, String formattedCaDiversAnneeCourante, 
                              String formattedCaDiversAnneePrecedente, String formattedCaTotalAnneeCourante, 
                              String formattedCaTotalAnneePrecedente) {
        this.bu = bu;
        this.caAutoAnneeCourante = caAutoAnneeCourante;
        this.caAutoAnneePrecedente = caAutoAnneePrecedente;
        this.tauxAuto = tauxAuto;
        this.caAtAnneeCourante = caAtAnneeCourante;
        this.caAtAnneePrecedente = caAtAnneePrecedente;
        this.tauxAt = tauxAt;
        this.caMaladieAnneeCourante = caMaladieAnneeCourante;
        this.caMaladieAnneePrecedente = caMaladieAnneePrecedente;
        this.tauxMaladie = tauxMaladie;
        this.caDiversAnneeCourante = caDiversAnneeCourante;
        this.caDiversAnneePrecedente = caDiversAnneePrecedente;
        this.tauxDivers = tauxDivers;
        this.caTotalAnneeCourante = caTotalAnneeCourante;
        this.caTotalAnneePrecedente = caTotalAnneePrecedente;
        this.tauxTotal = tauxTotal;
        this.formattedCaAutoAnneeCourante = formattedCaAutoAnneeCourante;
        this.formattedCaAutoAnneePrecedente = formattedCaAutoAnneePrecedente;
        this.formattedCaAtAnneeCourante = formattedCaAtAnneeCourante;
        this.formattedCaAtAnneePrecedente = formattedCaAtAnneePrecedente;
        this.formattedCaMaladieAnneeCourante = formattedCaMaladieAnneeCourante;
        this.formattedCaMaladieAnneePrecedente = formattedCaMaladieAnneePrecedente;
        this.formattedCaDiversAnneeCourante = formattedCaDiversAnneeCourante;
        this.formattedCaDiversAnneePrecedente = formattedCaDiversAnneePrecedente;
        this.formattedCaTotalAnneeCourante = formattedCaTotalAnneeCourante;
        this.formattedCaTotalAnneePrecedente = formattedCaTotalAnneePrecedente;
    }
}