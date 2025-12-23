package com.flashinfo.service.Impl;

import com.flashinfo.dto.CaNonVieVieDto;
import com.flashinfo.entity.CaVie;
import com.flashinfo.mapper.CaVieMapper;
import com.flashinfo.repository.CaNonVieVieRepository;  // CHANGÉ LE NOM
import com.flashinfo.repository.CaVieRepository;
import com.flashinfo.service.CaNonVieVieService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CaNonVieVieServiceImpl implements CaNonVieVieService {

    // CHANGÉ LES NOMS DES REPOSITORIES
    private final CaNonVieVieRepository caNonVieVieRepository;  // Nouveau nom
    private final CaVieRepository caVieRepository;
    private final CaVieMapper caVieMapper;
    // Supprime caNonVieMapper car tu n'en as plus besoin

    @Override
    public List<CaNonVieVieDto> getAllCaNonVieVie() {
        List<CaNonVieVieDto> result = new ArrayList<>();
        result.addAll(getCaNonVie());  // Appelle la méthode pour Non Vie
        result.addAll(getCaVie());     // Appelle la méthode pour Vie
        return result;
    }

    @Override
    public List<CaNonVieVieDto> getCaVie() {
        try {
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
            // Utilise la méthode native du Repository
            List<Object[]> results = caNonVieVieRepository.getSyntheseNonVieCAToday();
            return convertToDto(results);
            
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des données Non Vie: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<CaNonVieVieDto> convertToDto(List<Object[]> results) {
        List<CaNonVieVieDto> dtos = new ArrayList<>();
        
        for (Object[] row : results) {
            CaNonVieVieDto dto = new CaNonVieVieDto();
            
            // Convertit Object[] en DTO
            dto.setBu((String) row[0]);                     // BU
            dto.setAuto(roundToInteger((BigDecimal) row[1]));  // AUTO
            dto.setAt(roundToInteger((BigDecimal) row[2]));    // AT
            dto.setMaladie(roundToInteger((BigDecimal) row[3])); // MALADIE
            dto.setDivers(roundToInteger((BigDecimal) row[4])); // DIVERS
            dto.setVie(BigDecimal.ZERO);                     // VIE (toujours 0)
            dto.setTotal(roundToInteger((BigDecimal) row[5])); // Total
            
            dtos.add(dto);
        }
        
        return dtos;
    }

    private BigDecimal roundToInteger(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        return value.setScale(0, RoundingMode.HALF_UP);
    }
}