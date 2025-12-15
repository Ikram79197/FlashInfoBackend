
package com.flashinfo.repository;

import com.flashinfo.entity.CaVieThisMonth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaVieThisMonthRepository extends JpaRepository<CaVieThisMonth, Long> {

    @Query(value = """
    DECLARE @CurrentYear INT = YEAR(GETDATE());
    DECLARE @PreviousYear INT = @CurrentYear - 1;
    DECLARE @CurrentMonth INT = MONTH(GETDATE());
    DECLARE @PreviousMonthStr VARCHAR(2) = RIGHT('0' + CAST(@CurrentMonth - 1 AS VARCHAR(2)), 2);

    WITH CTE_Vie AS (
        SELECT 
            mutuelle AS BU,
            CASE 
                WHEN libelle_SousCategorie LIKE '%DECES%' THEN 'Deces'
                WHEN mutuelle = 'MCMA' AND libelle_SousCategorie = 'VIE GROUPE' THEN 'Retr'
                WHEN mutuelle = 'MCMA' AND libelle_SousCategorie LIKE '%CAPITALISATION%' THEN 'Capitalisation'
                WHEN mutuelle = 'MAC' AND libelle_SousCategorie LIKE '%CAPITALISATION%' 
                     AND libelle_produit NOT IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Capitalisation'
                WHEN mutuelle = 'MAC' AND libelle_produit IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Retr'
            END AS Code_branche,
            SUM(CASE WHEN exercice = CAST(@CurrentYear AS VARCHAR(4)) THEN montantHT ELSE 0 END) AS CA_CurrentYear,
            SUM(CASE WHEN exercice = CAST(@PreviousYear AS VARCHAR(4)) THEN montantHT ELSE 0 END) AS CA_PreviousYear
        FROM [dbo].[SMP_VIE_FRONTAL_DETAIL]
        WHERE NOT (mois_annulation BETWEEN '01' AND @PreviousMonthStr)
            AND mois <= @PreviousMonthStr
        GROUP BY mutuelle,
            CASE 
                WHEN libelle_SousCategorie LIKE '%DECES%' THEN 'Deces'
                WHEN mutuelle = 'MCMA' AND libelle_SousCategorie = 'VIE GROUPE' THEN 'Retr'
                WHEN mutuelle = 'MCMA' AND libelle_SousCategorie LIKE '%CAPITALISATION%' THEN 'Capitalisation'
                WHEN mutuelle = 'MAC' AND libelle_SousCategorie LIKE '%CAPITALISATION%' 
                     AND libelle_produit NOT IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Capitalisation'
                WHEN mutuelle = 'MAC' AND libelle_produit IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Retr'
            END
    ),
    CTE_Pivot AS (
        SELECT 
            BU,
            SUM(CASE WHEN Code_branche = 'Capitalisation' THEN CA_CurrentYear ELSE 0 END) AS Capitalisation_CurrentYear,
            SUM(CASE WHEN Code_branche = 'Capitalisation' THEN CA_PreviousYear ELSE 0 END) AS Capitalisation_PreviousYear,
            SUM(CASE WHEN Code_branche = 'Retr' THEN CA_CurrentYear ELSE 0 END) AS Retr_CurrentYear,
            SUM(CASE WHEN Code_branche = 'Retr' THEN CA_PreviousYear ELSE 0 END) AS Retr_PreviousYear,
            SUM(CASE WHEN Code_branche = 'Deces' THEN CA_CurrentYear ELSE 0 END) AS Deces_CurrentYear,
            SUM(CASE WHEN Code_branche = 'Deces' THEN CA_PreviousYear ELSE 0 END) AS Deces_PreviousYear,
            SUM(CA_CurrentYear) AS Total_CurrentYear,
            SUM(CA_PreviousYear) AS Total_PreviousYear
        FROM CTE_Vie
        WHERE Code_branche IS NOT NULL
        GROUP BY BU
    ),
    CTE_Calcul AS (
        SELECT 
            BU,
            Capitalisation_CurrentYear,
            CASE 
                WHEN Capitalisation_PreviousYear = 0 THEN 0
                ELSE ROUND(((Capitalisation_CurrentYear - Capitalisation_PreviousYear) / Capitalisation_PreviousYear) * 100, 2)
            END AS Taux_Capitalisation,
            Retr_CurrentYear,
            CASE 
                WHEN Retr_PreviousYear = 0 THEN 0
                ELSE ROUND(((Retr_CurrentYear - Retr_PreviousYear) / Retr_PreviousYear) * 100, 2)
            END AS Taux_Retr,
            Deces_CurrentYear,
            CASE 
                WHEN Deces_PreviousYear = 0 THEN 0
                ELSE ROUND(((Deces_CurrentYear - Deces_PreviousYear) / Deces_PreviousYear) * 100, 2)
            END AS Taux_Deces,
            Total_CurrentYear,
            CASE 
                WHEN Total_PreviousYear = 0 THEN 0
                ELSE ROUND(((Total_CurrentYear - Total_PreviousYear) / Total_PreviousYear) * 100, 2)
            END AS Taux_Total,
            CASE 
                WHEN BU = 'MAC' THEN 1
                WHEN BU = 'MCMA' THEN 2
                ELSE 3
            END AS ordre
        FROM CTE_Pivot
    ),
    CTE_Total AS (
        SELECT 
            'Total' AS BU,
            SUM(Capitalisation_CurrentYear) AS Capitalisation_CurrentYear,
            CASE 
                WHEN SUM(Capitalisation_PreviousYear) = 0 THEN 0
                ELSE ROUND(((SUM(Capitalisation_CurrentYear) - SUM(Capitalisation_PreviousYear)) / SUM(Capitalisation_PreviousYear)) * 100, 2)
            END AS Taux_Capitalisation,
            SUM(Retr_CurrentYear) AS Retr_CurrentYear,
            CASE 
                WHEN SUM(Retr_PreviousYear) = 0 THEN 0
                ELSE ROUND(((SUM(Retr_CurrentYear) - SUM(Retr_PreviousYear)) / SUM(Retr_PreviousYear)) * 100, 2)
            END AS Taux_Retr,
            SUM(Deces_CurrentYear) AS Deces_CurrentYear,
            CASE 
                WHEN SUM(Deces_PreviousYear) = 0 THEN 0
                ELSE ROUND(((SUM(Deces_CurrentYear) - SUM(Deces_PreviousYear)) / SUM(Deces_PreviousYear)) * 100, 2)
            END AS Taux_Deces,
            SUM(Total_CurrentYear) AS Total_CurrentYear,
            CASE 
                WHEN SUM(Total_PreviousYear) = 0 THEN 0
                ELSE ROUND(((SUM(Total_CurrentYear) - SUM(Total_PreviousYear)) / SUM(Total_PreviousYear)) * 100, 2)
            END AS Taux_Total,
            3 AS ordre
        FROM CTE_Pivot
    )
    SELECT 
        BU,
        CAST(ROUND(Capitalisation_CurrentYear, 0) AS BIGINT) AS CA_Capitalisation,
        Taux_Capitalisation AS [Taux d'évolution Capitalisation],
        CAST(ROUND(Retr_CurrentYear, 0) AS BIGINT) AS CA_Retr,
        Taux_Retr AS [Taux d'évolution Retr],
        CAST(ROUND(Deces_CurrentYear, 0) AS BIGINT) AS CA_Deces,
        Taux_Deces AS [Taux d'évolution Deces],
        CAST(ROUND(Total_CurrentYear, 0) AS BIGINT) AS CA_Total,
        Taux_Total AS [Taux d'évolution Total]
    FROM (
        SELECT * FROM CTE_Calcul
        UNION ALL
        SELECT * FROM CTE_Total
    ) AS FinalData
    ORDER BY ordre;
    """, nativeQuery = true)
    List<Object[]> findAllCaVieThisMonthNative();
}
