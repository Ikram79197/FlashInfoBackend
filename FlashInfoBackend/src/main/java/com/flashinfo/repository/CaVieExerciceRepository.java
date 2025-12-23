package com.flashinfo.repository;

import com.flashinfo.entity.CaVieExercice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaVieExerciceRepository extends JpaRepository<CaVieExercice, Long> {

    @Query(value = """
        WITH DATA AS (
            SELECT  
                segment,
                CASE  
                    WHEN libelle_SousCategorie LIKE '%DECES%' THEN 'DECES'
                    WHEN segment = 'MCMA' AND libelle_SousCategorie = 'VIE GROUPE' THEN 'RETRAITE'
                    WHEN segment = 'MCMA' AND libelle_SousCategorie LIKE '%CAPITALISATION%' THEN 'CAPITALISATION'
                    WHEN segment = 'MAC' AND libelle_SousCategorie LIKE '%CAPITALISATION%'  
                         AND libelle_produit NOT IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'CAPITALISATION'
                    WHEN segment = 'MAC' AND libelle_produit IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'RETRAITE'
                END AS Code_branche,

                SUM(CASE WHEN exercice = :yearPrev THEN primenette ELSE 0 END) AS CA_2024,
                SUM(CASE WHEN exercice = :yearCurr THEN primenette ELSE 0 END) AS CA_2025

            FROM SMP_PROD_AIS_JOURNALIER
            WHERE source = 'VIE'
            GROUP BY 
                segment,
                CASE  
                    WHEN libelle_SousCategorie LIKE '%DECES%' THEN 'DECES'
                    WHEN segment = 'MCMA' AND libelle_SousCategorie = 'VIE GROUPE' THEN 'RETRAITE'
                    WHEN segment = 'MCMA' AND libelle_SousCategorie LIKE '%CAPITALISATION%' THEN 'CAPITALISATION'
                    WHEN segment = 'MAC' AND libelle_SousCategorie LIKE '%CAPITALISATION%'  
                         AND libelle_produit NOT IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'CAPITALISATION'
                    WHEN segment = 'MAC' AND libelle_produit IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'RETRAITE'
                END
        )

        SELECT
            COALESCE(segment, 'TOTAL') AS SEGMENT,

            /* ===================== CAPITALISATION ===================== */
            SUM(CASE WHEN Code_branche = 'CAPITALISATION' THEN CA_2025 ELSE 0 END) AS CAP_CA_2025,
            SUM(CASE WHEN Code_branche = 'CAPITALISATION' THEN CA_2024 ELSE 0 END) AS CAP_CA_2024,
            ROUND(
                (SUM(CASE WHEN Code_branche = 'CAPITALISATION' THEN CA_2025 ELSE 0 END)
                / NULLIF(SUM(CASE WHEN Code_branche = 'CAPITALISATION' THEN CA_2024 ELSE 0 END),0)
                - 1) * 100
            ,2) AS CAP_TAUX,

            /* ===================== RETRAITE ===================== */
            SUM(CASE WHEN Code_branche = 'RETRAITE' THEN CA_2025 ELSE 0 END) AS RET_CA_2025,
            SUM(CASE WHEN Code_branche = 'RETRAITE' THEN CA_2024 ELSE 0 END) AS RET_CA_2024,
            ROUND(
                (SUM(CASE WHEN Code_branche = 'RETRAITE' THEN CA_2025 ELSE 0 END)
                / NULLIF(SUM(CASE WHEN Code_branche = 'RETRAITE' THEN CA_2024 ELSE 0 END),0)
                - 1) * 100
            ,2) AS RET_TAUX,

            /* ===================== DECES ===================== */
            SUM(CASE WHEN Code_branche = 'DECES' THEN CA_2025 ELSE 0 END) AS DEC_CA_2025,
            SUM(CASE WHEN Code_branche = 'DECES' THEN CA_2024 ELSE 0 END) AS DEC_CA_2024,
            ROUND(
                (SUM(CASE WHEN Code_branche = 'DECES' THEN CA_2025 ELSE 0 END)
                / NULLIF(SUM(CASE WHEN Code_branche = 'DECES' THEN CA_2024 ELSE 0 END),0)
                - 1) * 100
            ,2) AS DEC_TAUX,

            /* ===================== TOTAL ===================== */
            SUM(CA_2025) AS TOTAL_CA_2025,
            SUM(CA_2024) AS TOTAL_CA_2024,
            ROUND(
                (SUM(CA_2025) / NULLIF(SUM(CA_2024),0) - 1) * 100
            ,2) AS TOTAL_TAUX

        FROM DATA
        GROUP BY ROLLUP(segment)
        ORDER BY 
            CASE WHEN segment IS NULL THEN 2 ELSE 1 END,
            segment;
    """, nativeQuery = true)
    List<Object[]> findAllCaVieExerciceNative(String yearPrev, String yearCurr);
}
