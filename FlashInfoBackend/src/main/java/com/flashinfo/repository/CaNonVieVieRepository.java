package com.flashinfo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.stereotype.Repository;

import com.flashinfo.entity.CaNonVieVie;

import java.util.List;

@Repository
public interface CaNonVieVieRepository extends JpaRepository<CaNonVieVie, Long> {
    
    //#FIXME: Non Vie CA Synthèse Today
    @Query(value = "SELECT BU, AUTO, AT, MALADIE, DIVERS " +
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
            "        AND date_comptable = DATEADD(day, -1, CAST(GETDATE() AS DATE)) " +
            "        AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4)) " +
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
            "        AND date_comptable = DATEADD(day, -1, CAST(GETDATE() AS DATE)) " +
            "        AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4)) " +
            ") AS Resultats " +
            "ORDER BY tri", nativeQuery = true)
    List<Object[]> getSyntheseNonVieCAToday();

    //#FIXME:  Vie CA Synthèse Today
    @Query(value = """
        WITH ToutesCombinaisons AS (
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
        ),
        DonneesReelles AS (
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
        )
        SELECT
            'VIE' AS TYPE,
            tc.segment AS mutuelle,
            tc.Code_branche,
            ISNULL(dr.CA_reel, 0) AS montant
        FROM ToutesCombinaisons tc
        LEFT JOIN DonneesReelles dr 
            ON tc.segment = dr.segment 
            AND tc.Code_branche = dr.Code_branche
        ORDER BY 
            CASE WHEN tc.segment = 'MCMA' THEN 1 ELSE 2 END,
            CASE tc.Code_branche 
                WHEN 'Capitalisation' THEN 1 
                WHEN 'Retraite' THEN 2 
                WHEN 'Décés' THEN 3 
                ELSE 4 
            END
        """, nativeQuery = true)
    List<Object[]> getCaVieTable();
    
}