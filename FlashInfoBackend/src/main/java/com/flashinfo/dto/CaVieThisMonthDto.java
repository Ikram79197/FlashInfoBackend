package com.flashinfo.dto;

import java.math.BigDecimal;

public class CaVieThisMonthDto {
    private String bu;
    private BigDecimal caCapitalisation;
    private Double tauxCapitalisation;
    private BigDecimal caRetr;
    private Double tauxRetr;
    private BigDecimal caDeces;
    private Double tauxDeces;
    private BigDecimal caTotal;
    private Double tauxTotal;
    private Integer ordre;

    // Getters and setters
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
