package com.flashinfo.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ca_non_vie_exercice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaNonVieExercice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bu;

    @Column(name = "ca_auto_annee_courante")
    private BigDecimal caAutoAnneeCourante;

    @Column(name = "ca_auto_annee_precedente")
    private BigDecimal caAutoAnneePrecedente;

    @Column(name = "taux_auto")
    private BigDecimal tauxAuto;

    @Column(name = "ca_at_annee_courante")
    private BigDecimal caAtAnneeCourante;

    @Column(name = "ca_at_annee_precedente")
    private BigDecimal caAtAnneePrecedente;

    @Column(name = "taux_at")
    private BigDecimal tauxAt;

    @Column(name = "ca_maladie_annee_courante")
    private BigDecimal caMaladieAnneeCourante;

    @Column(name = "ca_maladie_annee_precedente")
    private BigDecimal caMaladieAnneePrecedente;

    @Column(name = "taux_maladie")
    private BigDecimal tauxMaladie;

    @Column(name = "ca_divers_annee_courante")
    private BigDecimal caDiversAnneeCourante;

    @Column(name = "ca_divers_annee_precedente")
    private BigDecimal caDiversAnneePrecedente;

    @Column(name = "taux_divers")
    private BigDecimal tauxDivers;

    @Column(name = "ca_total_annee_courante")
    private BigDecimal caTotalAnneeCourante;

    @Column(name = "ca_total_annee_precedente")
    private BigDecimal caTotalAnneePrecedente;

    @Column(name = "taux_total")
    private BigDecimal tauxTotal;
}
