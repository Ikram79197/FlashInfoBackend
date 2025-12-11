package com.flashinfo.dto;

import java.time.LocalDate;

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

    // Constructors
    public Emission500KDHSDto() {
    }

    public Emission500KDHSDto(String source, String compagnie, String segment, String police, 
                              String nomClient, String produit, String avenant, LocalDate dateEffet, 
                              LocalDate dateEmission, Double primeNette, String nomSite) {
        this.source = source;
        this.compagnie = compagnie;
        this.segment = segment;
        this.police = police;
        this.nomClient = nomClient;
        this.produit = produit;
        this.avenant = avenant;
        this.dateEffet = dateEffet;
        this.dateEmission = dateEmission;
        this.primeNette = primeNette;
        this.nomSite = nomSite;
    }

    // Getters and Setters
    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getCompagnie() {
        return compagnie;
    }

    public void setCompagnie(String compagnie) {
        this.compagnie = compagnie;
    }

    public String getSegment() {
        return segment;
    }

    public void setSegment(String segment) {
        this.segment = segment;
    }

    public String getPolice() {
        return police;
    }

    public void setPolice(String police) {
        this.police = police;
    }

    public String getNomClient() {
        return nomClient;
    }

    public void setNomClient(String nomClient) {
        this.nomClient = nomClient;
    }

    public String getProduit() {
        return produit;
    }

    public void setProduit(String produit) {
        this.produit = produit;
    }

    public String getAvenant() {
        return avenant;
    }

    public void setAvenant(String avenant) {
        this.avenant = avenant;
    }

    public LocalDate getDateEffet() {
        return dateEffet;
    }

    public void setDateEffet(LocalDate dateEffet) {
        this.dateEffet = dateEffet;
    }

    public LocalDate getDateEmission() {
        return dateEmission;
    }

    public void setDateEmission(LocalDate dateEmission) {
        this.dateEmission = dateEmission;
    }

    public Double getPrimeNette() {
        return primeNette;
    }

    public void setPrimeNette(Double primeNette) {
        this.primeNette = primeNette;
    }

    public String getNomSite() {
        return nomSite;
    }

    public void setNomSite(String nomSite) {
        this.nomSite = nomSite;
    }
}
