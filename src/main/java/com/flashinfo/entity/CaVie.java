package com.flashinfo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import java.math.BigDecimal;

@Entity
@Immutable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Subselect("""
    SELECT 
        ROW_NUMBER() OVER (ORDER BY 
            CASE WHEN tc.segment = 'MCMA' THEN 1 ELSE 2 END,
            CASE tc.Code_branche 
                WHEN 'Capitalisation' THEN 1 
                WHEN 'Retraite' THEN 2 
                WHEN 'Décés' THEN 3 
                ELSE 4 
            END
        ) AS id,
        tc.segment AS mutuelle,
        tc.Code_branche,
        ISNULL(dr.CA_reel, 0) AS montant
    FROM (
        SELECT 'MCMA' AS segment, 'Capitalisation' AS Code_branche
        UNION ALL
        SELECT 'MCMA', 'Retraite'
        UNION ALL
        SELECT 'MCMA', 'Décés'
        UNION ALL
        SELECT 'MAC', 'Capitalisation'
        UNION ALL
        SELECT 'MAC', 'Retraite'
        UNION ALL
        SELECT 'MAC', 'Décés'
    ) tc
    LEFT JOIN (
        SELECT
            segment,
            CASE
                WHEN libelle_SousCategorie LIKE '%DECES%' THEN 'Décés'
                WHEN segment = 'MCMA' AND libelle_SousCategorie = 'VIE GROUPE' THEN 'Retraite'
                WHEN segment = 'MCMA' AND libelle_SousCategorie LIKE '%CAPITALISATION%' THEN 'Capitalisation'
                WHEN segment = 'MAC' AND libelle_SousCategorie LIKE '%CAPITALISATION%' 
                     AND libelle_produit NOT IN ('RCCPM RETRAITE BCP', 'MARETRAITE BY MAC') THEN 'Capitalisation'
                WHEN segment = 'MAC' AND libelle_produit IN ('RCCPM RETRAITE BCP', 'MARETRAITE BY MAC') THEN 'Retraite'
                ELSE 'Non catégorisé'
            END AS Code_branche,
            SUM(primenette) AS CA_reel
        FROM SMP_PROD_AIS_JOURNALIER
        WHERE source = 'VIE'
            AND date_comptable = DATEADD(day, -1, CAST(GETDATE() AS DATE))
            AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4))
            AND segment IN ('MCMA', 'MAC')
        GROUP BY
            segment,
            CASE
                WHEN libelle_SousCategorie LIKE '%DECES%' THEN 'Décés'
                WHEN segment = 'MCMA' AND libelle_SousCategorie = 'VIE GROUPE' THEN 'Retraite'
                WHEN segment = 'MCMA' AND libelle_SousCategorie LIKE '%CAPITALISATION%' THEN 'Capitalisation'
                WHEN segment = 'MAC' AND libelle_SousCategorie LIKE '%CAPITALISATION%' 
                     AND libelle_produit NOT IN ('RCCPM RETRAITE BCP', 'MARETRAITE BY MAC') THEN 'Capitalisation'
                WHEN segment = 'MAC' AND libelle_produit IN ('RCCPM RETRAITE BCP', 'MARETRAITE BY MAC') THEN 'Retraite'
                ELSE 'Non catégorisé'
            END
    ) dr ON tc.segment = dr.segment AND tc.Code_branche = dr.Code_branche
    """)
public class CaVie {

    @Id
    private Long id;

    @Column(name = "mutuelle")
    private String mutuelle;

    @Column(name = "Code_branche")
    private String codeBranche;

    @Column(name = "montant")
    private BigDecimal montant;
}