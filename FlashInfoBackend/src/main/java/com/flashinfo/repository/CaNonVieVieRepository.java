package com.flashinfo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.flashinfo.entity.CaNonVie;
import java.util.List;

@Repository
public interface CaNonVieVieRepository extends JpaRepository<CaNonVie, Long> {
    
    // Non Vie CA Synthèse Today (corrigée pour fusionner MAMDA et MAMDA_HORS_MRC)
@Query(value = """
        WITH DATA AS (
            SELECT 
                CASE 
                    WHEN segment = 'DIRECT' THEN 'MCMA_DIRECT'
                    WHEN segment IN ('MAMDA', 'MAMDA_HORS_MRC') THEN 'MAMDA_HORS_MRC'
                    ELSE segment
                END AS BU,
                SUM(CASE WHEN Code_branche = '02' THEN primenette ELSE 0 END) AS AUTO,
                SUM(CASE WHEN Code_branche = '01' THEN primenette ELSE 0 END) AS AT,
                SUM(CASE WHEN Code_branche = '04' THEN primenette ELSE 0 END) AS MALADIE,
                SUM(CASE WHEN Code_branche NOT IN ('01','02','04') THEN primenette ELSE 0 END) AS DIVERS
            FROM SMP_PROD_AIS_JOURNALIER
            WHERE source <> 'VIE'
              AND date_comptable = DATEADD(day, -1, CAST(GETDATE() AS DATE))
              AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4))
            GROUP BY 
                CASE 
                    WHEN segment = 'DIRECT' THEN 'MCMA_DIRECT'
                    WHEN segment IN ('MAMDA', 'MAMDA_HORS_MRC') THEN 'MAMDA_HORS_MRC'
                    ELSE segment
                END
        ),
        FINAL AS (
            SELECT 
                BU,
                AUTO,
                AT,
                MALADIE,
                DIVERS,
                AUTO + AT + MALADIE + DIVERS AS Total,
                CASE BU
                    WHEN 'COURTAGE' THEN 1
                    WHEN 'MAEM' THEN 2
                    WHEN 'MAMDA_HORS_MRC' THEN 3
                    WHEN 'MCMA_DIRECT' THEN 4
                    WHEN 'Total' THEN 5
                    ELSE 6
                END AS tri
            FROM DATA
            UNION ALL
            SELECT 
                'Total',
                SUM(AUTO),
                SUM(AT),
                SUM(MALADIE),
                SUM(DIVERS),
                SUM(AUTO + AT + MALADIE + DIVERS),
                5
            FROM DATA
        )
        SELECT 
            BU,
            AUTO,
            AT,
            MALADIE,
            DIVERS,
            Total
        FROM FINAL
        ORDER BY tri
        """, nativeQuery = true)
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