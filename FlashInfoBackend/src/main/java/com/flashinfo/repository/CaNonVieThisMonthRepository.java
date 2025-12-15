package com.flashinfo.repository;

import com.flashinfo.entity.CaNonVieThisMonth;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaNonVieThisMonthRepository extends JpaRepository<CaNonVieThisMonth, Long> {
    
    @Query(value = """
        WITH CTE_Data AS (
            SELECT 
                bu AS BU,
                SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_AUTO_2025,
                SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_AUTO_2024,
                CASE 
                    WHEN SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END) = 0 
                    THEN 0 
                    ELSE ((SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN prime_nette ELSE 0 END) - 
                           SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END)) / 
                          NULLIF(SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END), 0)) * 100 
                END AS Taux_AUTO,
                SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_AT_2025,
                SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_AT_2024,
                CASE 
                    WHEN SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END) = 0 
                    THEN 0 
                    ELSE ((SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN prime_nette ELSE 0 END) - 
                           SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END)) / 
                          NULLIF(SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END), 0)) * 100 
                END AS Taux_AT,
                SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_MALADIE_2025,
                SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_MALADIE_2024,
                CASE 
                    WHEN SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END) = 0 
                    THEN 0 
                    ELSE ((SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN prime_nette ELSE 0 END) - 
                           SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END)) / 
                          NULLIF(SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END), 0)) * 100 
                END AS Taux_MALADIE,
                SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_DIVERS_2025,
                SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_DIVERS_2024,
                CASE 
                    WHEN SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END) = 0 
                    THEN 0 
                    ELSE ((SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN prime_nette ELSE 0 END) - 
                           SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END)) / 
                          NULLIF(SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END), 0)) * 100 
                END AS Taux_DIVERS,
                SUM(CASE WHEN ANNEE = CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_TOTAL_2025,
                SUM(CASE WHEN ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_TOTAL_2024,
                CASE 
                    WHEN SUM(CASE WHEN ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END) = 0 
                    THEN 0 
                    ELSE ((SUM(CASE WHEN ANNEE = CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN prime_nette ELSE 0 END) - 
                           SUM(CASE WHEN ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END)) / 
                          NULLIF(SUM(CASE WHEN ANNEE = CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN prime_nette ELSE 0 END), 0)) * 100 
                END AS Taux_TOTAL,
                CASE bu 
                    WHEN 'COURTAGE' THEN 1 
                    WHEN 'MAEM' THEN 2 
                    WHEN 'MAMDA_HORS_MRC' THEN 3 
                    WHEN 'MCMA_DIRECT' THEN 4 
                    ELSE 5 
                END AS ordre
            FROM SMP_PROD_BU_BRH_FIN
            WHERE NOT (mois_annul BETWEEN '01' AND '12') 
                AND mois <= CAST(MONTH(GETDATE()) - 1 AS VARCHAR(2))
                AND VISION = 'C'
            GROUP BY bu
        ),
        CTE_Total AS (
            SELECT 
                'Total' AS BU,
                SUM(CA_AUTO_2025) AS CA_AUTO_2025,
                SUM(CA_AUTO_2024) AS CA_AUTO_2024,
                CASE 
                    WHEN SUM(CA_AUTO_2024) = 0 THEN 0
                    ELSE ((SUM(CA_AUTO_2025) - SUM(CA_AUTO_2024)) / NULLIF(SUM(CA_AUTO_2024), 0)) * 100
                END AS Taux_AUTO,
                SUM(CA_AT_2025) AS CA_AT_2025,
                SUM(CA_AT_2024) AS CA_AT_2024,
                CASE 
                    WHEN SUM(CA_AT_2024) = 0 THEN 0
                    ELSE ((SUM(CA_AT_2025) - SUM(CA_AT_2024)) / NULLIF(SUM(CA_AT_2024), 0)) * 100
                END AS Taux_AT,
                SUM(CA_MALADIE_2025) AS CA_MALADIE_2025,
                SUM(CA_MALADIE_2024) AS CA_MALADIE_2024,
                CASE 
                    WHEN SUM(CA_MALADIE_2024) = 0 THEN 0
                    ELSE ((SUM(CA_MALADIE_2025) - SUM(CA_MALADIE_2024)) / NULLIF(SUM(CA_MALADIE_2024), 0)) * 100
                END AS Taux_MALADIE,
                SUM(CA_DIVERS_2025) AS CA_DIVERS_2025,
                SUM(CA_DIVERS_2024) AS CA_DIVERS_2024,
                CASE 
                    WHEN SUM(CA_DIVERS_2024) = 0 THEN 0
                    ELSE ((SUM(CA_DIVERS_2025) - SUM(CA_DIVERS_2024)) / NULLIF(SUM(CA_DIVERS_2024), 0)) * 100
                END AS Taux_DIVERS,
                SUM(CA_TOTAL_2025) AS CA_TOTAL_2025,
                SUM(CA_TOTAL_2024) AS CA_TOTAL_2024,
                CASE 
                    WHEN SUM(CA_TOTAL_2024) = 0 THEN 0
                    ELSE ((SUM(CA_TOTAL_2025) - SUM(CA_TOTAL_2024)) / NULLIF(SUM(CA_TOTAL_2024), 0)) * 100
                END AS Taux_TOTAL,
                5 AS ordre
            FROM CTE_Data
        )
        SELECT 
            BU,
            CA_AUTO_2025,
            CA_AUTO_2024,
            Taux_AUTO,
            CA_AT_2025,
            CA_AT_2024,
            Taux_AT,
            CA_MALADIE_2025,
            CA_MALADIE_2024,
            Taux_MALADIE,
            CA_DIVERS_2025,
            CA_DIVERS_2024,
            Taux_DIVERS,
            CA_TOTAL_2025,
            CA_TOTAL_2024,
            Taux_TOTAL
        FROM (
            SELECT 
                BU,
                CA_AUTO_2025,
                CA_AUTO_2024,
                Taux_AUTO,
                CA_AT_2025,
                CA_AT_2024,
                Taux_AT,
                CA_MALADIE_2025,
                CA_MALADIE_2024,
                Taux_MALADIE,
                CA_DIVERS_2025,
                CA_DIVERS_2024,
                Taux_DIVERS,
                CA_TOTAL_2025,
                CA_TOTAL_2024,
                Taux_TOTAL,
                ordre
            FROM CTE_Data
            WHERE BU <> 'Total'
            
            UNION ALL
            
            SELECT 
                BU,
                CA_AUTO_2025,
                CA_AUTO_2024,
                Taux_AUTO,
                CA_AT_2025,
                CA_AT_2024,
                Taux_AT,
                CA_MALADIE_2025,
                CA_MALADIE_2024,
                Taux_MALADIE,
                CA_DIVERS_2025,
                CA_DIVERS_2024,
                Taux_DIVERS,
                CA_TOTAL_2025,
                CA_TOTAL_2024,
                Taux_TOTAL,
                ordre
            FROM CTE_Total
        ) AS CombinedData
        ORDER BY ordre
        """, nativeQuery = true)
    List<Object[]> findAllCaNonVieThisMonthNative();
}