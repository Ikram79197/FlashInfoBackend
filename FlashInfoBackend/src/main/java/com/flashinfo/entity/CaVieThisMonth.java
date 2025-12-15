package com.flashinfo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class CaVieThisMonth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bu;

    @Column(name = "ca_capitalisation")
    private BigDecimal caCapitalisation;

    @Column(name = "taux_capitalisation")
    private Double tauxCapitalisation;

    @Column(name = "ca_retr")
    private BigDecimal caRetr;

    @Column(name = "taux_retr")
    private Double tauxRetr;

    @Column(name = "ca_deces")
    private BigDecimal caDeces;

    @Column(name = "taux_deces")
    private Double tauxDeces;

    @Column(name = "ca_total")
    private BigDecimal caTotal;

    @Column(name = "taux_total")
    private Double tauxTotal;

    private Integer ordre;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBu() { return bu; }
    public void setBu(String bu) { this.bu = bu; }

    public BigDecimal getCaCapitalisation() { return caCapitalisation; }
    public void setCaCapitalisation(BigDecimal caCapitalisation) { this.caCapitalisation = caCapitalisation; }

    public Double getTauxCapitalisation() { return tauxCapitalisation; }
    public void setTauxCapitalisation(Double tauxCapitalisation) { this.tauxCapitalisation = tauxCapitalisation; }

    public BigDecimal getCaRetr() { return caRetr; }
    public void setCaRetr(BigDecimal caRetr) { this.caRetr = caRetr; }

    public Double getTauxRetr() { return tauxRetr; }
    public void setTauxRetr(Double tauxRetr) { this.tauxRetr = tauxRetr; }

    public BigDecimal getCaDeces() { return caDeces; }
    public void setCaDeces(BigDecimal caDeces) { this.caDeces = caDeces; }

    public Double getTauxDeces() { return tauxDeces; }
    public void setTauxDeces(Double tauxDeces) { this.tauxDeces = tauxDeces; }

    public BigDecimal getCaTotal() { return caTotal; }
    public void setCaTotal(BigDecimal caTotal) { this.caTotal = caTotal; }

    public Double getTauxTotal() { return tauxTotal; }
    public void setTauxTotal(Double tauxTotal) { this.tauxTotal = tauxTotal; }

    public Integer getOrdre() { return ordre; }
    public void setOrdre(Integer ordre) { this.ordre = ordre; }
}
