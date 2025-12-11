package com.flashinfo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.Subselect;
import org.hibernate.annotations.Synchronize;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Subselect("""
    SELECT 
        ROW_NUMBER() OVER (ORDER BY TYPE) as id,
        TYPE as type_assurance,
        CAST(GETDATE() as DATE) as date_reference,
        CAST(SUM(primetotale_N_1) as DECIMAL(19,2)) as primetotale_n_1,
        CAST(SUM(primetotale_N) as DECIMAL(19,2)) as primetotale_n,
        CAST(SUM(prime_JN) as DECIMAL(19,2)) as prime_jn,
        CAST(SUM(primetotale_MP_N+primetotale_N) as DECIMAL(19,2)) as primetotale_yd,
        CAST(SUM(primetotale_MP_N) as DECIMAL(19,2)) as primetotale_mp_n,
        CAST(CASE WHEN SUM(primetotale_N_1) = 0 THEN 0 
                  ELSE CAST(SUM(primetotale_N) AS FLOAT) / NULLIF(SUM(primetotale_N_1), 0) * 100 
             END as DECIMAL(8,2)) as taux_remplissage_n,
        CAST(CASE WHEN SUM(primetotale_YD_1) = 0 THEN 0 
                  ELSE SUM(primetotale_YD-primetotale_YD_1) / SUM(primetotale_YD_1) * 100 
             END as DECIMAL(8,2)) as taux_evolution_yd,
        CAST(CASE WHEN SUM(primetotale_MP_N_1) = 0 THEN 0 
                  ELSE SUM(primetotale_MP_N-primetotale_MP_N_1) / SUM(primetotale_MP_N_1) * 100 
             END as DECIMAL(8,2)) as taux_evolution_mp,
        YEAR(GETDATE()) as annee,
        MONTH(GETDATE()) as mois
    FROM [dbo].[SMP_CA_RECAP_FLASH_INFO]
    GROUP BY TYPE
""")
@Synchronize({"SMP_CA_RECAP_FLASH_INFO"})
@Immutable
// Remove @Table annotation completely
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChiffreAffaires {
    
    @Id
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type_assurance")
    private TypeAssurance typeAssurance;
    
    @Column(name = "date_reference")
    private LocalDate dateReference;
    
    @Column(name = "primetotale_n_1")
    private BigDecimal primetotaleN1;
    
    @Column(name = "primetotale_n")
    private BigDecimal primetotaleN;
    
    @Column(name = "prime_jn")
    private BigDecimal primeJN;
    
    @Column(name = "primetotale_yd")
    private BigDecimal primetotaleYD;
    
    @Column(name = "primetotale_mp_n")
    private BigDecimal primetotaleMPN;
    
    @Column(name = "taux_remplissage_n")
    private BigDecimal tauxRemplissageN;
    
    @Column(name = "taux_evolution_yd")
    private BigDecimal tauxEvolutionYD;
    
    @Column(name = "taux_evolution_mp")
    private BigDecimal tauxEvolutionMP;
    
    @Column(name = "annee")
    private Integer annee;
    
    @Column(name = "mois")
    private Integer mois;
    
    public enum TypeAssurance {
        NON_VIE("Non Vie"),
        VIE("Vie"),
        TOTAL("Total");
        
        private final String displayName;
        
        TypeAssurance(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}