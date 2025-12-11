package com.flashinfo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "SMP_PROD_AIS_500000")
public class Emission500KDHS {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source")
    private String source;

    @Column(name = "compagnie")
    private String compagnie;

    @Column(name = "segment")
    private String segment;

    @Column(name = "police")
    private String police;

    @Column(name = "nomclient")
    private String nomClient;

    @Column(name = "libelleproduit")
    private String produit;

    @Column(name = "nomavenant")
    private String avenant;

    @Column(name = "dateeffet")
    private LocalDate dateEffet;

    @Column(name = "dateemission")
    private LocalDate dateEmission;

    @Column(name = "primenette")
    private Double primeNette;

    @Column(name = "nom_site")
    private String nomSite;

    @Column(name = "exercice")
    private Integer exercice;

    @Column(name = "date_comptable")
    private LocalDate dateComptable;

    // Constructors
    public Emission500KDHS() {
    }

    public Emission500KDHS(Long id, String source, String compagnie, String segment, String police, 
                           String nomClient, String produit, String avenant, LocalDate dateEffet, 
                           LocalDate dateEmission, Double primeNette, String nomSite, 
                           Integer exercice, LocalDate dateComptable) {
        this.id = id;
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
        this.exercice = exercice;
        this.dateComptable = dateComptable;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Integer getExercice() {
        return exercice;
    }

    public void setExercice(Integer exercice) {
        this.exercice = exercice;
    }

    public LocalDate getDateComptable() {
        return dateComptable;
    }

    public void setDateComptable(LocalDate dateComptable) {
        this.dateComptable = dateComptable;
    }
}
