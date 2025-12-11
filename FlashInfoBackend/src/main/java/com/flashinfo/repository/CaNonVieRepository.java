package com.flashinfo.repository;

import com.flashinfo.entity.CaNonVie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaNonVieRepository extends JpaRepository<CaNonVie, Long> {
    // Pas besoin de méthode personnalisée - findAll() retournera les données de la sous-requête
}