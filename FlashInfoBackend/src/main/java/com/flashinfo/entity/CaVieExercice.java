package com.flashinfo.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ca_vie_exercice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaVieExercice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String segment;

    // Capitalisation
    @Column(name = "cap_ca_courante")
    private BigDecimal capCaCourante;
    @Column(name = "cap_ca_precedente")
    private BigDecimal capCaPrecedente;
    @Column(name = "cap_taux")
    private BigDecimal capTaux;

    // Retraite
    @Column(name = "ret_ca_courante")
    private BigDecimal retCaCourante;
    @Column(name = "ret_ca_precedente")
    private BigDecimal retCaPrecedente;
    @Column(name = "ret_taux")
    private BigDecimal retTaux;

    // Deces
    @Column(name = "dec_ca_courante")
    private BigDecimal decCaCourante;
    @Column(name = "dec_ca_precedente")
    private BigDecimal decCaPrecedente;
    @Column(name = "dec_taux")
    private BigDecimal decTaux;

    // Total
    @Column(name = "total_ca_courante")
    private BigDecimal totalCaCourante;
    @Column(name = "total_ca_precedente")
    private BigDecimal totalCaPrecedente;
    @Column(name = "total_taux")
    private BigDecimal totalTaux;

    @Column(name = "ordre_tri")
    private Integer ordreTri;
}
