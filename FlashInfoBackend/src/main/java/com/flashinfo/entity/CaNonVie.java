package com.flashinfo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Subselect;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;

@Entity
@Immutable
@Subselect("""
    SELECT 
        ROW_NUMBER() OVER (ORDER BY tri) AS id,
        BU, 
        AUTO, 
        AT, 
        MALADIE, 
        DIVERS,
        (AUTO + AT + MALADIE + DIVERS) AS total
    FROM (
        SELECT 
            CASE segment 
                WHEN 'DIRECT' THEN 'MCMA_DIRECT' 
                WHEN 'MAMDA' THEN 'MAMDA_HORS_MRC' 
                ELSE segment 
            END AS BU,
            SUM(CASE WHEN Code_branche = '02' THEN primenette ELSE 0 END) AS AUTO,
            SUM(CASE WHEN Code_branche = '01' THEN primenette ELSE 0 END) AS AT,
            SUM(CASE WHEN Code_branche = '04' THEN primenette ELSE 0 END) AS MALADIE,
            SUM(CASE WHEN Code_branche NOT IN ('01', '02', '04') THEN primenette ELSE 0 END) AS DIVERS,
            CASE 
                WHEN segment = 'COURTAGE' THEN 1 
                WHEN segment = 'MAEM' THEN 2 
                WHEN segment = 'MAMDA' THEN 3 
                WHEN segment = 'DIRECT' THEN 4 
                ELSE 5 
            END AS tri
        FROM SMP_PROD_AIS_JOURNALIER
        WHERE source <> 'VIE'
            AND date_comptable = DATEADD(day, -1, CAST(GETDATE() AS DATE))
            AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4))
        GROUP BY 
            CASE segment 
                WHEN 'DIRECT' THEN 'MCMA_DIRECT' 
                WHEN 'MAMDA' THEN 'MAMDA_HORS_MRC' 
                ELSE segment 
            END,
            CASE 
                WHEN segment = 'COURTAGE' THEN 1 
                WHEN segment = 'MAEM' THEN 2 
                WHEN segment = 'MAMDA' THEN 3 
                WHEN segment = 'DIRECT' THEN 4 
                ELSE 5 
            END
        
        UNION ALL
        
        SELECT 
            'Total' AS BU,
            SUM(CASE WHEN Code_branche = '02' THEN primenette ELSE 0 END) AS AUTO,
            SUM(CASE WHEN Code_branche = '01' THEN primenette ELSE 0 END) AS AT,
            SUM(CASE WHEN Code_branche = '04' THEN primenette ELSE 0 END) AS MALADIE,
            SUM(CASE WHEN Code_branche NOT IN ('01', '02', '04') THEN primenette ELSE 0 END) AS DIVERS,
            5 AS tri
        FROM SMP_PROD_AIS_JOURNALIER
        WHERE source <> 'VIE'
            AND date_comptable = DATEADD(day, -1, CAST(GETDATE() AS DATE))
            AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4))
    ) AS Resultats
    """)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CaNonVie {
    
    @Id
    private Long id;
    
    @Column(name = "BU")
    private String bu;
    
    @Column(name = "AUTO")
    private BigDecimal auto;
    
    @Column(name = "AT")
    private BigDecimal at;
    
    @Column(name = "MALADIE")
    private BigDecimal maladie;
    
    @Column(name = "DIVERS")
    private BigDecimal divers;
    
    @Column(name = "total")
    private BigDecimal total;
}
