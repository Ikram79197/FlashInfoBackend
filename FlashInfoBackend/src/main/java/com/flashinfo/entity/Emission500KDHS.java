package com.flashinfo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "SMP_PROD_AIS_500000")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
}
