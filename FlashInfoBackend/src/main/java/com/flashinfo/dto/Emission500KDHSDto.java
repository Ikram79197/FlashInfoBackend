package com.flashinfo.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Emission500KDHSDto {

    private String source;
    private String compagnie;
    private String segment;
    private String police;
    private String nomClient;
    private String produit;
    private String avenant;
    private LocalDate dateEffet;
    private LocalDate dateEmission;
    private Double primeNette;
    private String nomSite;
}
