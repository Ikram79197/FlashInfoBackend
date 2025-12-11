package com.flashinfo.repository;

import com.flashinfo.entity.CaVie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaVieRepository extends JpaRepository<CaVie, Long> {
    // Pas besoin de méthode personnalisée - findAll() retournera les données de la sous-requête CTE
}