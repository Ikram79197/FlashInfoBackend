package com.flashinfo.repository;

import com.flashinfo.entity.CaVie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaVieMensuelRepository extends JpaRepository<CaVie, Long> {
    
    @Query(value = """
        WITH CTE_VIE AS (
            SELECT  
                'VIE' AS TYPE, 
                mois, 
                mutuelle,  
                CASE      
                    WHEN libelle_SousCategorie LIKE '%DECES%' THEN 'Décés' 
                    WHEN mutuelle='MCMA' AND libelle_SousCategorie ='VIE GROUPE' THEN 'Retraite'
                    WHEN mutuelle='MCMA' AND libelle_SousCategorie LIKE '%CAPITALISATION%' THEN 'Capitalisation' 
                    WHEN mutuelle='MAC' AND libelle_SousCategorie LIKE '%CAPITALISATION%' AND libelle_produit
                        NOT IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Capitalisation'   
                    WHEN mutuelle='MAC' AND libelle_produit IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Retraite'
                END AS Code_branche,      
                SUM(CASE exercice WHEN CAST(YEAR(GETDATE()) - 1 AS VARCHAR(4)) THEN montantHT ELSE 0 END) AS primetotale_N_1, 
                0 AS primetotale_N    
            FROM [dbo].[SMP_VIE_FRONTAL_DETAIL]  
            WHERE (mois = CAST(MONTH(GETDATE()) AS VARCHAR(2)))       
            GROUP BY mois, mutuelle,     
                CASE  
                    WHEN libelle_SousCategorie LIKE '%DECES%' THEN 'Décés'
                    WHEN mutuelle='MCMA' AND libelle_SousCategorie ='VIE GROUPE' THEN 'Retraite' 
                    WHEN mutuelle='MCMA' AND libelle_SousCategorie LIKE '%CAPITALISATION%' THEN 'Capitalisation' 
                    WHEN mutuelle='MAC' AND libelle_SousCategorie LIKE '%CAPITALISATION%' AND libelle_produit 
                        NOT IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Capitalisation' 
                    WHEN mutuelle='MAC' AND libelle_produit IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Retraite' 
                END     
            
            UNION ALL 
            
            SELECT 
                'VIE' AS TYPE,   
                MONTH(date_comptable) AS mois,
                segment AS mutuelle,      
                CASE    
                    WHEN libelle_SousCategorie LIKE '%DECES%' THEN 'Décés' 
                    WHEN segment='MCMA' AND libelle_SousCategorie ='VIE GROUPE' THEN 'Retraite' 
                    WHEN segment='MCMA' AND libelle_SousCategorie LIKE '%CAPITALISATION%' THEN 'Capitalisation' 
                    WHEN segment='MAC' AND libelle_SousCategorie LIKE '%CAPITALISATION%' AND libelle_produit 
                        NOT IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Capitalisation'    
                    WHEN segment='MAC' AND libelle_produit IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Retraite' 
                END AS Code_branche,      
                0 AS primetotale_N_1,  
                SUM(CASE exercice WHEN CAST(YEAR(GETDATE()) AS VARCHAR(4)) THEN primenette ELSE 0 END) AS primetotale_N 
            FROM SMP_PROD_AIS_JOURNALIER    
            WHERE source = 'VIE' AND mois_annulation = CAST(MONTH(GETDATE()) AS VARCHAR(2))  
            GROUP BY MONTH(date_comptable), segment,   
                CASE   
                    WHEN libelle_SousCategorie LIKE '%DECES%' THEN 'Décés'  
                    WHEN segment='MCMA' AND libelle_SousCategorie ='VIE GROUPE' THEN 'Retraite' 
                    WHEN segment='MCMA' AND libelle_SousCategorie LIKE '%CAPITALISATION%' THEN 'Capitalisation' 
                    WHEN segment='MAC' AND libelle_SousCategorie LIKE '%CAPITALISATION%' AND libelle_produit 
                        NOT IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Capitalisation' 
                    WHEN segment='MAC' AND libelle_produit IN ('RCCPM RETRAITE BCP','MARETRAITE BY MAC') THEN 'Retraite'     
                END
        ),
        CTE_Aggregated AS (
            SELECT 
                mutuelle,
                Code_branche,
                SUM(primetotale_N_1) AS CA_N_1,
                SUM(primetotale_N) AS CA_N
            FROM CTE_VIE
            WHERE Code_branche IS NOT NULL
            GROUP BY mutuelle, Code_branche
        ),
        CTE_Pivot AS (
            SELECT 
                mutuelle,
                SUM(CASE WHEN Code_branche = 'Capitalisation' THEN CA_N ELSE 0 END) AS CA_Capitalisation,
                SUM(CASE WHEN Code_branche = 'Capitalisation' THEN CA_N_1 ELSE 0 END) AS CA_N_1_Capitalisation,
                SUM(CASE WHEN Code_branche = 'Retraite' THEN CA_N ELSE 0 END) AS CA_Retraite,
                SUM(CASE WHEN Code_branche = 'Retraite' THEN CA_N_1 ELSE 0 END) AS CA_N_1_Retraite,
                SUM(CASE WHEN Code_branche = 'Décés' THEN CA_N ELSE 0 END) AS CA_Deces,
                SUM(CASE WHEN Code_branche = 'Décés' THEN CA_N_1 ELSE 0 END) AS CA_N_1_Deces
            FROM CTE_Aggregated
            GROUP BY mutuelle
        ),
        CTE_Final AS (
            SELECT 
                mutuelle,
                CA_Capitalisation,
                CASE 
                    WHEN CA_N_1_Capitalisation = 0 THEN 0
                    ELSE CAST((CA_Capitalisation / NULLIF(CA_N_1_Capitalisation, 0)) * 100 AS DECIMAL(10,2))
                END AS Taux_Remplissage_Capitalisation,
                CA_Retraite,
                CASE 
                    WHEN CA_N_1_Retraite = 0 THEN 0
                    ELSE CAST((CA_Retraite / NULLIF(CA_N_1_Retraite, 0)) * 100 AS DECIMAL(10,2))
                END AS Taux_Remplissage_Retraite,
                CA_Deces,
                CASE 
                    WHEN CA_N_1_Deces = 0 THEN 0
                    ELSE CAST((CA_Deces / NULLIF(CA_N_1_Deces, 0)) * 100 AS DECIMAL(10,2))
                END AS Taux_Remplissage_Deces,
                (CA_Capitalisation + CA_Retraite + CA_Deces) AS CA_Total,
                CASE 
                    WHEN (CA_N_1_Capitalisation + CA_N_1_Retraite + CA_N_1_Deces) = 0 THEN 0
                    ELSE CAST(((CA_Capitalisation + CA_Retraite + CA_Deces) / 
                          NULLIF((CA_N_1_Capitalisation + CA_N_1_Retraite + CA_N_1_Deces), 0)) * 100 AS DECIMAL(10,2))
                END AS Taux_Remplissage_Total,
                CASE mutuelle
                    WHEN 'MAC' THEN 1
                    WHEN 'MCMA' THEN 2
                    WHEN 'Total' THEN 3
                    ELSE 4
                END AS ordre
            FROM CTE_Pivot
        
            UNION ALL
        
            SELECT 
                'Total' AS mutuelle,
                SUM(CA_Capitalisation) AS CA_Capitalisation,
                CASE 
                    WHEN SUM(CA_N_1_Capitalisation) = 0 THEN 0
                    ELSE CAST((SUM(CA_Capitalisation) / NULLIF(SUM(CA_N_1_Capitalisation), 0)) * 100 AS DECIMAL(10,2))
                END AS Taux_Remplissage_Capitalisation,
                SUM(CA_Retraite) AS CA_Retraite,
                CASE 
                    WHEN SUM(CA_N_1_Retraite) = 0 THEN 0
                    ELSE CAST((SUM(CA_Retraite) / NULLIF(SUM(CA_N_1_Retraite), 0)) * 100 AS DECIMAL(10,2))
                END AS Taux_Remplissage_Retraite,
                SUM(CA_Deces) AS CA_Deces,
                CASE 
                    WHEN SUM(CA_N_1_Deces) = 0 THEN 0
                    ELSE CAST((SUM(CA_Deces) / NULLIF(SUM(CA_N_1_Deces), 0)) * 100 AS DECIMAL(10,2))
                END AS Taux_Remplissage_Deces,
                SUM(CA_Capitalisation + CA_Retraite + CA_Deces) AS CA_Total,
                CASE 
                    WHEN SUM(CA_N_1_Capitalisation + CA_N_1_Retraite + CA_N_1_Deces) = 0 THEN 0
                    ELSE CAST((SUM(CA_Capitalisation + CA_Retraite + CA_Deces) / 
                          NULLIF(SUM(CA_N_1_Capitalisation + CA_N_1_Retraite + CA_N_1_Deces), 0)) * 100 AS DECIMAL(10,2))
                END AS Taux_Remplissage_Total,
                3 AS ordre
            FROM CTE_Pivot
        )
        SELECT 
            mutuelle,
            CA_Capitalisation,
            Taux_Remplissage_Capitalisation,
            CA_Retraite,
            Taux_Remplissage_Retraite,
            CA_Deces,
            Taux_Remplissage_Deces,
            CA_Total,
            Taux_Remplissage_Total
        FROM CTE_Final
        ORDER BY ordre
        """, nativeQuery = true)
    List<Object[]> getCaVieMensuel();
}
