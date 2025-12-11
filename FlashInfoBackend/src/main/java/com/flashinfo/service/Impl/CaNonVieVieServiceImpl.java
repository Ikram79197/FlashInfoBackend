package com.flashinfo.service.Impl;

import com.flashinfo.dto.CaNonVieVieDto;
import com.flashinfo.entity.CaNonVie;
import com.flashinfo.entity.CaVie;
import com.flashinfo.mapper.CaNonVieMapper;
import com.flashinfo.mapper.CaVieMapper;
import com.flashinfo.repository.CaNonVieRepository;
import com.flashinfo.repository.CaVieRepository;
import com.flashinfo.service.CaNonVieVieService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CaNonVieVieServiceImpl implements CaNonVieVieService {

    private final CaNonVieRepository caNonVieRepository;
    private final CaVieRepository caVieRepository;
    private final CaNonVieMapper caNonVieMapper;
    private final CaVieMapper caVieMapper;

    @Override
    public List<CaNonVieVieDto> getAllCaNonVieVie() {
        List<CaNonVieVieDto> result = new ArrayList<>();
        result.addAll(getCaNonVie());
        result.addAll(getCaVie());
        return result;
    }

    @Override
    public List<CaNonVieVieDto> getCaVie() {
        try {
            // 1. La requête CTE dans l'entity CaVie s'exécute automatiquement
            // 2. findAll() récupère les résultats
            // 3. MapStruct mappe automatiquement CaVie -> CaNonVieVieDto avec arrondi
            List<CaVie> entities = caVieRepository.findAll();
            return caVieMapper.toDtoList(entities);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des données Vie: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public List<CaNonVieVieDto> getCaNonVie() {
        try {
            // 1. La requête @Subselect dans l'entity CaNonVie s'exécute automatiquement
            // 2. findAll() récupère les résultats
            // 3. MapStruct mappe automatiquement CaNonVie -> CaNonVieVieDto avec arrondi
            List<CaNonVie> entities = caNonVieRepository.findAll();
            return caNonVieMapper.toDtoList(entities);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des données Non Vie: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}