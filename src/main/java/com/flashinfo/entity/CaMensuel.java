package com.flashinfo.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Subselect;
import java.math.BigDecimal;

@Entity
@Subselect("SELECT " +
    "ROW_NUMBER() OVER (ORDER BY tri) as id, " +
    "BU, AUTO, AT, MALADIE, DIVERS " +
    "FROM ( " +
    "    SELECT " +
    "        CASE segment " +
    "            WHEN 'DIRECT' THEN 'MCMA_DIRECT' " +
    "            WHEN 'MAMDA' THEN 'MAMDA_HORS_MRC' " +
    "            ELSE segment " +
    "        END AS BU, " +
    "        SUM(CASE WHEN Code_branche = '02' THEN primenette ELSE 0 END) AS AUTO, " +
    "        SUM(CASE WHEN Code_branche = '01' THEN primenette ELSE 0 END) AS AT, " +
    "        SUM(CASE WHEN Code_branche = '04' THEN primenette ELSE 0 END) AS MALADIE, " +
    "        SUM(CASE WHEN Code_branche NOT IN ('01', '02', '04') THEN primenette ELSE 0 END) AS DIVERS, " +
    "        CASE " +
    "            WHEN segment = 'COURTAGE' THEN 1 " +
    "            WHEN segment = 'MAEM' THEN 2 " +
    "            WHEN segment = 'MAMDA' THEN 3 " +
    "            WHEN segment = 'DIRECT' THEN 4 " +
    "            ELSE 5 " +
    "        END AS tri " +
    "    FROM SMP_PROD_AIS_JOURNALIER " +
    "    WHERE source <> 'VIE' " +
    "        AND MONTH(date_comptable) = MONTH(GETDATE()) " +
    "        AND YEAR(date_comptable) = YEAR(GETDATE()) " +
    "        AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR) " +
    "    GROUP BY " +
    "        CASE segment " +
    "            WHEN 'DIRECT' THEN 'MCMA_DIRECT' " +
    "            WHEN 'MAMDA' THEN 'MAMDA_HORS_MRC' " +
    "            ELSE segment " +
    "        END, " +
    "        CASE " +
    "            WHEN segment = 'COURTAGE' THEN 1 " +
    "            WHEN segment = 'MAEM' THEN 2 " +
    "            WHEN segment = 'MAMDA' THEN 3 " +
    "            WHEN segment = 'DIRECT' THEN 4 " +
    "            ELSE 5 " +
    "        END " +
    "    UNION ALL " +
    "    SELECT " +
    "        'Total' AS BU, " +
    "        SUM(CASE WHEN Code_branche = '02' THEN primenette ELSE 0 END) AS AUTO, " +
    "        SUM(CASE WHEN Code_branche = '01' THEN primenette ELSE 0 END) AS AT, " +
    "        SUM(CASE WHEN Code_branche = '04' THEN primenette ELSE 0 END) AS MALADIE, " +
    "        SUM(CASE WHEN Code_branche NOT IN ('01', '02', '04') THEN primenette ELSE 0 END) AS DIVERS, " +
    "        5 AS tri " +
    "    FROM SMP_PROD_AIS_JOURNALIER " +
    "    WHERE source <> 'VIE' " +
    "        AND MONTH(date_comptable) = MONTH(GETDATE()) " +
    "        AND YEAR(date_comptable) = YEAR(GETDATE()) " +
    "        AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR) " +
    ") AS Resultats " +
    "ORDER BY tri")
public class CaMensuel {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "BU")
    private String businessUnit;

    @Column(name = "AUTO")
    private BigDecimal auto;

    @Column(name = "AT")
    private BigDecimal at;

    @Column(name = "MALADIE")
    private BigDecimal maladie;

    @Column(name = "DIVERS")
    private BigDecimal divers;

    // Constructeurs
    public CaMensuel() {}

    public CaMensuel(Long id, String businessUnit, BigDecimal auto, BigDecimal at, BigDecimal maladie, BigDecimal divers) {
        this.id = id;
        this.businessUnit = businessUnit;
        this.auto = auto;
        this.at = at;
        this.maladie = maladie;
        this.divers = divers;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBusinessUnit() {
        return businessUnit;
    }

    public void setBusinessUnit(String businessUnit) {
        this.businessUnit = businessUnit;
    }

    public BigDecimal getAuto() {
        return auto;
    }

    public void setAuto(BigDecimal auto) {
        this.auto = auto;
    }

    public BigDecimal getAt() {
        return at;
    }

    public void setAt(BigDecimal at) {
        this.at = at;
    }

    public BigDecimal getMaladie() {
        return maladie;
    }

    public void setMaladie(BigDecimal maladie) {
        this.maladie = maladie;
    }

    public BigDecimal getDivers() {
        return divers;
    }

    public void setDivers(BigDecimal divers) {
        this.divers = divers;
    }
}