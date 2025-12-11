package com.flashinfo.repository;

import com.flashinfo.entity.CaNonVieVie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaNoVieMensuelRepository extends JpaRepository<CaNonVieVie, Long> {
    
    @Query(value = """
        WITH CTE_Base AS (
            SELECT 
                t.BU,
                t.Code_branche,
                SUM(t.primetotale_N_1) AS primetotale_N_1,
                SUM(t.primetotale_N) AS primetotale_N
            FROM (
                SELECT 
                    bu AS BU,
                    CASE 
                        WHEN Code_branche = 'AUTO' THEN 'AUTO'
                        WHEN Code_branche = 'AT' THEN 'AT'
                        WHEN Code_branche = 'MALADIE' THEN 'MALADIE'
                        ELSE 'DIVERS' 
                    END AS Code_branche,
                    SUM(CASE WHEN ANNEE = '2024' THEN prime_nette ELSE 0 END) AS primetotale_N_1,
                    0 AS primetotale_N
                FROM SMP_PROD_BU_BRH_FIN
                WHERE code_branche <> 'XX' 
                    AND NOT (mois_annul BETWEEN '01' AND '12')
                    AND mois = '12'
                    AND VISION = 'C'
                GROUP BY bu, Code_branche

                UNION ALL

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
                    END AS Code_branche,
                    0 AS primetotale_N_1,
                    SUM(primenette) AS primetotale_N
                FROM SMP_PROD_AIS_JOURNALIER
                WHERE source <> 'VIE' 
                    AND MONTH(date_comptable) = MONTH(GETDATE())
                    AND YEAR(date_comptable) = YEAR(GETDATE())
                    AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4))
                    AND segment IN ('COURTAGE', 'MAEM', 'MAMDA', 'DIRECT', 'MCMA_DIRECT', 'MAMDA_HORS_MRC')
                GROUP BY segment, Code_branche
            ) AS t
            GROUP BY t.BU, t.Code_branche
        ),
        CTE_Aggregated AS (
            SELECT 
                BU,
                Code_branche,
                SUM(primetotale_N) AS primetotale_N,
                SUM(primetotale_N_1) AS primetotale_N_1
            FROM CTE_Base
            GROUP BY BU, Code_branche
        )
        SELECT 
            BU,
            SUM(CASE WHEN Code_branche = 'AUTO' THEN primetotale_N ELSE 0 END) AS AUTO,
            SUM(CASE WHEN Code_branche = 'AUTO' THEN primetotale_N_1 ELSE 0 END) AS obj_AUTO,
            SUM(CASE WHEN Code_branche = 'AT' THEN primetotale_N ELSE 0 END) AS AT,
            SUM(CASE WHEN Code_branche = 'AT' THEN primetotale_N_1 ELSE 0 END) AS obj_AT,
            SUM(CASE WHEN Code_branche = 'MALADIE' THEN primetotale_N ELSE 0 END) AS MALADIE,
            SUM(CASE WHEN Code_branche = 'MALADIE' THEN primetotale_N_1 ELSE 0 END) AS obj_MALADIE,
            SUM(CASE WHEN Code_branche = 'DIVERS' THEN primetotale_N ELSE 0 END) AS DIVERS,
            SUM(CASE WHEN Code_branche = 'DIVERS' THEN primetotale_N_1 ELSE 0 END) AS obj_DIVERS
        FROM CTE_Aggregated
        GROUP BY BU
        ORDER BY 
            CASE BU
                WHEN 'COURTAGE' THEN 1
                WHEN 'MAEM' THEN 2
                WHEN 'MAMDA_HORS_MRC' THEN 3
                WHEN 'MCMA_DIRECT' THEN 4
                ELSE 5
            END
        """, nativeQuery = true)
    List<Object[]> getCaVieMensuel();
    
    @Query(value = """
        SELECT 
            CASE segment
                WHEN 'DIRECT' THEN 'MCMA_DIRECT'
                WHEN 'MAMDA' THEN 'MAMDA_HORS_MRC'
                ELSE segment
            END AS BU,
            SUM(CASE WHEN Code_branche = '02' THEN primenette ELSE 0 END) AS AUTO,
            SUM(CASE WHEN Code_branche = '01' THEN primenette ELSE 0 END) AS AT,
            SUM(CASE WHEN Code_branche = '04' THEN primenette ELSE 0 END) AS MALADIE,
            SUM(CASE WHEN Code_branche NOT IN ('01', '02', '04') THEN primenette ELSE 0 END) AS DIVERS
        FROM SMP_PROD_AIS_JOURNALIER
        WHERE source <> 'VIE'
            AND date_comptable >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
            AND date_comptable <= DATEADD(day, -1, CAST(GETDATE() AS DATE))
            AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4))
        GROUP BY 
            CASE segment
                WHEN 'DIRECT' THEN 'MCMA_DIRECT'
                WHEN 'MAMDA' THEN 'MAMDA_HORS_MRC'
                ELSE segment
            END
        ORDER BY 
            CASE 
                CASE segment
                    WHEN 'DIRECT' THEN 'MCMA_DIRECT'
                    WHEN 'MAMDA' THEN 'MAMDA_HORS_MRC'
                    ELSE segment
                END
                WHEN 'COURTAGE' THEN 1
                WHEN 'MAEM' THEN 2
                WHEN 'MAMDA_HORS_MRC' THEN 3
                WHEN 'MCMA_DIRECT' THEN 4
                ELSE 5
            END
        """, nativeQuery = true)
    List<Object[]> getCaNonVieMensuel();
}
