package com.flashinfo.repository;

import com.flashinfo.entity.ChiffreAffaires;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiffreAffairesRepository extends JpaRepository<ChiffreAffaires, Long> {
    
    List<ChiffreAffaires> findAll();
    
    // Filter by insurance type
    List<ChiffreAffaires> findByTypeAssurance(ChiffreAffaires.TypeAssurance typeAssurance);
    
    // Custom query for ordering - Non Vie first, then Vie
    @Query("SELECT c FROM ChiffreAffaires c ORDER BY CASE WHEN c.typeAssurance = 'NON_VIE' THEN 1 WHEN c.typeAssurance = 'VIE' THEN 2 ELSE 3 END")
    List<ChiffreAffaires> findAllOrdered();
}