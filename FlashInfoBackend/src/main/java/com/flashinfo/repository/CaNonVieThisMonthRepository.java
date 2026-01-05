package com.flashinfo.repository;

import com.flashinfo.entity.CaNonVieThisMonth;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface CaNonVieThisMonthRepository extends JpaRepository<CaNonVieThisMonth, Long> {
    
    @Query(value = """
        WITH CTE_Data AS (
            SELECT 
                bu AS BU,
                SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(:currentYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_AUTO_CURRENT,
                SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_AUTO_PREVIOUS,
                CASE 
                    WHEN SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) = 0 
                    THEN 0 
                    ELSE ((SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(:currentYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) - 
                           SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END)) / 
                          NULLIF(SUM(CASE WHEN Code_branche = 'AUTO' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END), 0)) * 100 
                END AS Taux_AUTO,
                SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(:currentYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_AT_CURRENT,
                SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_AT_PREVIOUS,
                CASE 
                    WHEN SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) = 0 
                    THEN 0 
                    ELSE ((SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(:currentYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) - 
                           SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END)) / 
                          NULLIF(SUM(CASE WHEN Code_branche = 'AT' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END), 0)) * 100 
                END AS Taux_AT,
                SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(:currentYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_MALADIE_CURRENT,
                SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_MALADIE_PREVIOUS,
                CASE 
                    WHEN SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) = 0 
                    THEN 0 
                    ELSE ((SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(:currentYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) - 
                           SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END)) / 
                          NULLIF(SUM(CASE WHEN Code_branche = 'MALADIE' AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END), 0)) * 100 
                END AS Taux_MALADIE,
                SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(:currentYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_DIVERS_CURRENT,
                SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_DIVERS_PREVIOUS,
                CASE 
                    WHEN SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) = 0 
                    THEN 0 
                    ELSE ((SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(:currentYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) - 
                           SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END)) / 
                          NULLIF(SUM(CASE WHEN Code_branche NOT IN ('AUTO', 'AT', 'MALADIE') AND ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END), 0)) * 100 
                END AS Taux_DIVERS,
                SUM(CASE WHEN ANNEE = CAST(:currentYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_TOTAL_CURRENT,
                SUM(CASE WHEN ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) AS CA_TOTAL_PREVIOUS,
                CASE 
                    WHEN SUM(CASE WHEN ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) = 0 
                    THEN 0 
                    ELSE ((SUM(CASE WHEN ANNEE = CAST(:currentYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END) - 
                           SUM(CASE WHEN ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END)) / 
                          NULLIF(SUM(CASE WHEN ANNEE = CAST(:previousYear AS VARCHAR(4)) THEN prime_nette ELSE 0 END), 0)) * 100 
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
                AND mois <= '12'
                AND VISION = 'C'
            GROUP BY bu
        ),
        CTE_Total AS (
            SELECT 
                'Total' AS BU,
                SUM(CA_AUTO_CURRENT) AS CA_AUTO_CURRENT,
                SUM(CA_AUTO_PREVIOUS) AS CA_AUTO_PREVIOUS,
                CASE 
                    WHEN SUM(CA_AUTO_PREVIOUS) = 0 THEN 0
                    ELSE ((SUM(CA_AUTO_CURRENT) - SUM(CA_AUTO_PREVIOUS)) / NULLIF(SUM(CA_AUTO_PREVIOUS), 0)) * 100
                END AS Taux_AUTO,
                SUM(CA_AT_CURRENT) AS CA_AT_CURRENT,
                SUM(CA_AT_PREVIOUS) AS CA_AT_PREVIOUS,
                CASE 
                    WHEN SUM(CA_AT_PREVIOUS) = 0 THEN 0
                    ELSE ((SUM(CA_AT_CURRENT) - SUM(CA_AT_PREVIOUS)) / NULLIF(SUM(CA_AT_PREVIOUS), 0)) * 100
                END AS Taux_AT,
                SUM(CA_MALADIE_CURRENT) AS CA_MALADIE_CURRENT,
                SUM(CA_MALADIE_PREVIOUS) AS CA_MALADIE_PREVIOUS,
                CASE 
                    WHEN SUM(CA_MALADIE_PREVIOUS) = 0 THEN 0
                    ELSE ((SUM(CA_MALADIE_CURRENT) - SUM(CA_MALADIE_PREVIOUS)) / NULLIF(SUM(CA_MALADIE_PREVIOUS), 0)) * 100
                END AS Taux_MALADIE,
                SUM(CA_DIVERS_CURRENT) AS CA_DIVERS_CURRENT,
                SUM(CA_DIVERS_PREVIOUS) AS CA_DIVERS_PREVIOUS,
                CASE 
                    WHEN SUM(CA_DIVERS_PREVIOUS) = 0 THEN 0
                    ELSE ((SUM(CA_DIVERS_CURRENT) - SUM(CA_DIVERS_PREVIOUS)) / NULLIF(SUM(CA_DIVERS_PREVIOUS), 0)) * 100
                END AS Taux_DIVERS,
                SUM(CA_TOTAL_CURRENT) AS CA_TOTAL_CURRENT,
                SUM(CA_TOTAL_PREVIOUS) AS CA_TOTAL_PREVIOUS,
                CASE 
                    WHEN SUM(CA_TOTAL_PREVIOUS) = 0 THEN 0
                    ELSE ((SUM(CA_TOTAL_CURRENT) - SUM(CA_TOTAL_PREVIOUS)) / NULLIF(SUM(CA_TOTAL_PREVIOUS), 0)) * 100
                END AS Taux_TOTAL,
                5 AS ordre
            FROM CTE_Data
        )
        SELECT 
            BU,
            CA_AUTO_CURRENT,
            CA_AUTO_PREVIOUS,
            Taux_AUTO,
            CA_AT_CURRENT,
            CA_AT_PREVIOUS,
            Taux_AT,
            CA_MALADIE_CURRENT,
            CA_MALADIE_PREVIOUS,
            Taux_MALADIE,
            CA_DIVERS_CURRENT,
            CA_DIVERS_PREVIOUS,
            Taux_DIVERS,
            CA_TOTAL_CURRENT,
            CA_TOTAL_PREVIOUS,
            Taux_TOTAL
        FROM (
            SELECT 
                BU,
                CA_AUTO_CURRENT,
                CA_AUTO_PREVIOUS,
                Taux_AUTO,
                CA_AT_CURRENT,
                CA_AT_PREVIOUS,
                Taux_AT,
                CA_MALADIE_CURRENT,
                CA_MALADIE_PREVIOUS,
                Taux_MALADIE,
                CA_DIVERS_CURRENT,
                CA_DIVERS_PREVIOUS,
                Taux_DIVERS,
                CA_TOTAL_CURRENT,
                CA_TOTAL_PREVIOUS,
                Taux_TOTAL,
                ordre
            FROM CTE_Data
            WHERE BU <> 'Total'
            
            UNION ALL
            
            SELECT 
                BU,
                CA_AUTO_CURRENT,
                CA_AUTO_PREVIOUS,
                Taux_AUTO,
                CA_AT_CURRENT,
                CA_AT_PREVIOUS,
                Taux_AT,
                CA_MALADIE_CURRENT,
                CA_MALADIE_PREVIOUS,
                Taux_MALADIE,
                CA_DIVERS_CURRENT,
                CA_DIVERS_PREVIOUS,
                Taux_DIVERS,
                CA_TOTAL_CURRENT,
                CA_TOTAL_PREVIOUS,
                Taux_TOTAL,
                ordre
            FROM CTE_Total
        ) AS CombinedData
        ORDER BY ordre
        """, nativeQuery = true)
    List<Object[]> findAllCaNonVieThisMonthNative(@Param("currentYear") int currentYear, @Param("previousYear") int previousYear);
}