package com.flashinfo.repository;

import com.flashinfo.entity.CaNonVieExercice;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaNonVieExerciceRepository extends JpaRepository<CaNonVieExercice, Long> {
    
    @Query(value = """
        WITH CTE_Data AS (
            SELECT 
                CASE 
                    WHEN segment = 'DIRECT' THEN 'MCMA_DIRECT'  
                    WHEN segment = 'MAMDA' THEN 'MAMDA_HORS_MRC'
                    ELSE segment  
                END AS BU,
                CASE 
                    WHEN Code_branche = '02' THEN 'AUTO'  
                    WHEN Code_branche = '01' THEN 'AT' 
                    WHEN Code_branche = '04' THEN 'MALADIE' 
                    ELSE 'DIVERS'  
                END AS Branche,
                CASE 
                    WHEN segment = 'COURTAGE' THEN 1  
                    WHEN segment = 'MAEM' THEN 2 
                    WHEN segment LIKE '%MAMDA%' THEN 3 
                    ELSE 4 
                END AS bu_ordre,
                SUM(CASE WHEN YEAR(date_comptable) = YEAR(GETDATE()) THEN primenette ELSE 0 END) AS CA_N,
                SUM(CASE WHEN YEAR(date_comptable) = YEAR(GETDATE()) - 1 THEN primenette ELSE 0 END) AS CA_N_1
            FROM SMP_PROD_AIS_JOURNALIER 
            WHERE source <> 'VIE'   
                AND date_comptable <= CAST(GETDATE() AS DATE)
                AND YEAR(date_comptable) >= YEAR(GETDATE()) - 1
            GROUP BY 
                CASE 
                    WHEN segment = 'DIRECT' THEN 'MCMA_DIRECT'  
                    WHEN segment = 'MAMDA' THEN 'MAMDA_HORS_MRC'
                    ELSE segment  
                END,
                CASE 
                    WHEN Code_branche = '02' THEN 'AUTO'  
                    WHEN Code_branche = '01' THEN 'AT' 
                    WHEN Code_branche = '04' THEN 'MALADIE' 
                    ELSE 'DIVERS'  
                END,
                CASE 
                    WHEN segment = 'COURTAGE' THEN 1  
                    WHEN segment = 'MAEM' THEN 2 
                    WHEN segment LIKE '%MAMDA%' THEN 3 
                    ELSE 4 
                END
        ),
        CTE_Pivot AS (
            SELECT 
                BU,
                bu_ordre,
                SUM(CASE WHEN Branche = 'AUTO' THEN CA_N ELSE 0 END) AS CA_AUTO_N,
                SUM(CASE WHEN Branche = 'AUTO' THEN CA_N_1 ELSE 0 END) AS CA_AUTO_N_1,
                SUM(CASE WHEN Branche = 'AT' THEN CA_N ELSE 0 END) AS CA_AT_N,
                SUM(CASE WHEN Branche = 'AT' THEN CA_N_1 ELSE 0 END) AS CA_AT_N_1,
                SUM(CASE WHEN Branche = 'MALADIE' THEN CA_N ELSE 0 END) AS CA_MALADIE_N,
                SUM(CASE WHEN Branche = 'MALADIE' THEN CA_N_1 ELSE 0 END) AS CA_MALADIE_N_1,
                SUM(CASE WHEN Branche = 'DIVERS' THEN CA_N ELSE 0 END) AS CA_DIVERS_N,
                SUM(CASE WHEN Branche = 'DIVERS' THEN CA_N_1 ELSE 0 END) AS CA_DIVERS_N_1,
                SUM(CA_N) AS CA_TOTAL_N,
                SUM(CA_N_1) AS CA_TOTAL_N_1
            FROM CTE_Data
            GROUP BY BU, bu_ordre
        ),
        CTE_WithTaux AS (
            SELECT 
                BU,
                bu_ordre,
                CA_AUTO_N,
                CA_AUTO_N_1,
                CASE WHEN CA_AUTO_N_1 = 0 THEN 0 ELSE ROUND(((CA_AUTO_N - CA_AUTO_N_1) / CA_AUTO_N_1) * 100, 2) END AS Taux_AUTO,
                CA_AT_N,
                CA_AT_N_1,
                CASE WHEN CA_AT_N_1 = 0 THEN 0 ELSE ROUND(((CA_AT_N - CA_AT_N_1) / CA_AT_N_1) * 100, 2) END AS Taux_AT,
                CA_MALADIE_N,
                CA_MALADIE_N_1,
                CASE WHEN CA_MALADIE_N_1 = 0 THEN 0 ELSE ROUND(((CA_MALADIE_N - CA_MALADIE_N_1) / CA_MALADIE_N_1) * 100, 2) END AS Taux_MALADIE,
                CA_DIVERS_N,
                CA_DIVERS_N_1,
                CASE WHEN CA_DIVERS_N_1 = 0 THEN 0 ELSE ROUND(((CA_DIVERS_N - CA_DIVERS_N_1) / CA_DIVERS_N_1) * 100, 2) END AS Taux_DIVERS,
                CA_TOTAL_N,
                CA_TOTAL_N_1,
                CASE WHEN CA_TOTAL_N_1 = 0 THEN 0 ELSE ROUND(((CA_TOTAL_N - CA_TOTAL_N_1) / CA_TOTAL_N_1) * 100, 2) END AS Taux_TOTAL
            FROM CTE_Pivot
        )
        SELECT 
            BU,
            CA_AUTO_N,
            CA_AUTO_N_1,
            Taux_AUTO,
            CA_AT_N,
            CA_AT_N_1,
            Taux_AT,
            CA_MALADIE_N,
            CA_MALADIE_N_1,
            Taux_MALADIE,
            CA_DIVERS_N,
            CA_DIVERS_N_1,
            Taux_DIVERS,
            CA_TOTAL_N,
            CA_TOTAL_N_1,
            Taux_TOTAL,
            bu_ordre AS OrdreTri
        FROM CTE_WithTaux

        UNION ALL

        SELECT 
            'Total' AS BU,
            SUM(CA_AUTO_N),
            SUM(CA_AUTO_N_1),
            CASE WHEN SUM(CA_AUTO_N_1) = 0 THEN 0 ELSE ROUND(((SUM(CA_AUTO_N) - SUM(CA_AUTO_N_1)) / SUM(CA_AUTO_N_1)) * 100, 2) END,
            SUM(CA_AT_N),
            SUM(CA_AT_N_1),
            CASE WHEN SUM(CA_AT_N_1) = 0 THEN 0 ELSE ROUND(((SUM(CA_AT_N) - SUM(CA_AT_N_1)) / SUM(CA_AT_N_1)) * 100, 2) END,
            SUM(CA_MALADIE_N),
            SUM(CA_MALADIE_N_1),
            CASE WHEN SUM(CA_MALADIE_N_1) = 0 THEN 0 ELSE ROUND(((SUM(CA_MALADIE_N) - SUM(CA_MALADIE_N_1)) / SUM(CA_MALADIE_N_1)) * 100, 2) END,
            SUM(CA_DIVERS_N),
            SUM(CA_DIVERS_N_1),
            CASE WHEN SUM(CA_DIVERS_N_1) = 0 THEN 0 ELSE ROUND(((SUM(CA_DIVERS_N) - SUM(CA_DIVERS_N_1)) / SUM(CA_DIVERS_N_1)) * 100, 2) END,
            SUM(CA_TOTAL_N),
            SUM(CA_TOTAL_N_1),
            CASE WHEN SUM(CA_TOTAL_N_1) = 0 THEN 0 ELSE ROUND(((SUM(CA_TOTAL_N) - SUM(CA_TOTAL_N_1)) / SUM(CA_TOTAL_N_1)) * 100, 2) END,
            5 AS OrdreTri
        FROM CTE_WithTaux

        ORDER BY OrdreTri
    """, nativeQuery = true)
    List<Object[]> findAllCaNonVieExerciceNative();
}