package com.flashinfo.repository;

import com.flashinfo.entity.Emission500KDHS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface Emission500KDHSRepository extends JpaRepository<Emission500KDHS, Long> {

    @Query(value = "SELECT source, compagnie, segment, police, nomclient, libelleproduit, " +
                   "nomavenant, dateeffet, dateemission, primenette, nom_site " +
                   "FROM SMP_PROD_AIS_500000 " +
                   "WHERE exercice = :exercice " +
                   "AND source <> 'VIE' " +
                   "AND date_comptable = :dateComptable", 
           nativeQuery = true)
    List<Object[]> findEmissions500KDHS(@Param("exercice") Integer exercice, 
                                        @Param("dateComptable") LocalDate dateComptable);
}
