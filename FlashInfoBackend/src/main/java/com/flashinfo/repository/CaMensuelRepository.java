package com.flashinfo.repository;

import com.flashinfo.entity.CaNonVieVie;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaMensuelRepository extends JpaRepository<CaNonVieVie, Long> {
    
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
        
        UNION ALL
        
        SELECT 
            'Total' AS BU,
            SUM(CASE WHEN Code_branche = '02' THEN primenette ELSE 0 END) AS AUTO,
            SUM(CASE WHEN Code_branche = '01' THEN primenette ELSE 0 END) AS AT,
            SUM(CASE WHEN Code_branche = '04' THEN primenette ELSE 0 END) AS MALADIE,
            SUM(CASE WHEN Code_branche NOT IN ('01', '02', '04') THEN primenette ELSE 0 END) AS DIVERS
        FROM SMP_PROD_AIS_JOURNALIER
        WHERE source <> 'VIE'
            AND date_comptable >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
            AND date_comptable <= DATEADD(day, -1, CAST(GETDATE() AS DATE))
            AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4))
        ORDER BY 
            CASE BU
                WHEN 'COURTAGE' THEN 1
                WHEN 'MAEM' THEN 2
                WHEN 'MAMDA_HORS_MRC' THEN 3
                WHEN 'MCMA_DIRECT' THEN 4
                WHEN 'Total' THEN 5
                ELSE 6
            END
        """, nativeQuery = true)
    List<Object[]> getCaNonVieMensuel();
    
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
        WHERE source = 'VIE'
            AND date_comptable >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
            AND date_comptable <= DATEADD(day, -1, CAST(GETDATE() AS DATE))
            AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4))
        GROUP BY 
            CASE segment
                WHEN 'DIRECT' THEN 'MCMA_DIRECT'
                WHEN 'MAMDA' THEN 'MAMDA_HORS_MRC'
                ELSE segment
            END
        
        UNION ALL
        
        SELECT 
            'Total' AS BU,
            SUM(CASE WHEN Code_branche = '02' THEN primenette ELSE 0 END) AS AUTO,
            SUM(CASE WHEN Code_branche = '01' THEN primenette ELSE 0 END) AS AT,
            SUM(CASE WHEN Code_branche = '04' THEN primenette ELSE 0 END) AS MALADIE,
            SUM(CASE WHEN Code_branche NOT IN ('01', '02', '04') THEN primenette ELSE 0 END) AS DIVERS
        FROM SMP_PROD_AIS_JOURNALIER
        WHERE source = 'VIE'
            AND date_comptable >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
            AND date_comptable <= DATEADD(day, -1, CAST(GETDATE() AS DATE))
            AND exercice = CAST(YEAR(GETDATE()) AS VARCHAR(4))
        ORDER BY 
            CASE BU
                WHEN 'COURTAGE' THEN 1
                WHEN 'MAEM' THEN 2
                WHEN 'MAMDA_HORS_MRC' THEN 3
                WHEN 'MCMA_DIRECT' THEN 4
                WHEN 'Total' THEN 5
                ELSE 6
            END
        """, nativeQuery = true)
    List<Object[]> getCaVieMensuel();
}
