package com.flashinfo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CaVieExerciceDto {
    private String segment;

    // Capitalisation
    private Double capCaCourante;
    private Double capCaPrecedente;
    private Double capTaux;

    // Retraite
    private Double retCaCourante;
    private Double retCaPrecedente;
    private Double retTaux;

    // Deces
    private Double decCaCourante;
    private Double decCaPrecedente;
    private Double decTaux;

    // Total
    private Double totalCaCourante;
    private Double totalCaPrecedente;
    private Double totalTaux;

    // Formatted strings (optional)
    @Builder.Default
    private String formattedCapCaCourante = "";
    @Builder.Default
    private String formattedCapCaPrecedente = "";
    @Builder.Default
    private String formattedRetCaCourante = "";
    @Builder.Default
    private String formattedRetCaPrecedente = "";
    @Builder.Default
    private String formattedDecCaCourante = "";
    @Builder.Default
    private String formattedDecCaPrecedente = "";
    @Builder.Default
    private String formattedTotalCaCourante = "";
    @Builder.Default
    private String formattedTotalCaPrecedente = "";

    public CaVieExerciceDto() {
    }

    public CaVieExerciceDto(String segment,
                            Double capCaCourante,
                            Double capCaPrecedente,
                            Double capTaux,
                            Double retCaCourante,
                            Double retCaPrecedente,
                            Double retTaux,
                            Double decCaCourante,
                            Double decCaPrecedente,
                            Double decTaux,
                            Double totalCaCourante,
                            Double totalCaPrecedente,
                            Double totalTaux,
                            String formattedCapCaCourante,
                            String formattedCapCaPrecedente,
                            String formattedRetCaCourante,
                            String formattedRetCaPrecedente,
                            String formattedDecCaCourante,
                            String formattedDecCaPrecedente,
                            String formattedTotalCaCourante,
                            String formattedTotalCaPrecedente) {
        this.segment = segment;
        this.capCaCourante = capCaCourante;
        this.capCaPrecedente = capCaPrecedente;
        this.capTaux = capTaux;
        this.retCaCourante = retCaCourante;
        this.retCaPrecedente = retCaPrecedente;
        this.retTaux = retTaux;
        this.decCaCourante = decCaCourante;
        this.decCaPrecedente = decCaPrecedente;
        this.decTaux = decTaux;
        this.totalCaCourante = totalCaCourante;
        this.totalCaPrecedente = totalCaPrecedente;
        this.totalTaux = totalTaux;
        this.formattedCapCaCourante = formattedCapCaCourante;
        this.formattedCapCaPrecedente = formattedCapCaPrecedente;
        this.formattedRetCaCourante = formattedRetCaCourante;
        this.formattedRetCaPrecedente = formattedRetCaPrecedente;
        this.formattedDecCaCourante = formattedDecCaCourante;
        this.formattedDecCaPrecedente = formattedDecCaPrecedente;
        this.formattedTotalCaCourante = formattedTotalCaCourante;
        this.formattedTotalCaPrecedente = formattedTotalCaPrecedente;
    }
}
