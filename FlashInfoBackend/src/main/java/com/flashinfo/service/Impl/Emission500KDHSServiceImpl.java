package com.flashinfo.service.Impl;

import com.flashinfo.dto.Emission500KDHSDto;
import com.flashinfo.repository.Emission500KDHSRepository;
import com.flashinfo.service.Emission500KDHSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class Emission500KDHSServiceImpl implements Emission500KDHSService {

    @Autowired
    private Emission500KDHSRepository emission500KDHSRepository;

    @Override
    public List<Emission500KDHSDto> getEmissions500KDHS() {
        // Calculer la date d'hier
        LocalDate dateComptable = LocalDate.now().minusDays(1);
        Integer exercice = 2025;

        List<Object[]> results = emission500KDHSRepository.findEmissions500KDHS(exercice, dateComptable);
        List<Emission500KDHSDto> dtoList = new ArrayList<>();

        for (Object[] row : results) {
            Emission500KDHSDto dto = new Emission500KDHSDto();
            dto.setSource(row[0] != null ? row[0].toString() : null);
            dto.setCompagnie(row[1] != null ? row[1].toString() : null);
            dto.setSegment(row[2] != null ? row[2].toString() : null);
            dto.setPolice(row[3] != null ? row[3].toString() : null);
            dto.setNomClient(row[4] != null ? row[4].toString() : null);
            dto.setProduit(row[5] != null ? row[5].toString() : null);
            dto.setAvenant(row[6] != null ? row[6].toString() : null);
            
            // Conversion sécurisée des dates
            if (row[7] != null) {
                if (row[7] instanceof Date) {
                    dto.setDateEffet(((Date) row[7]).toLocalDate());
                } else if (row[7] instanceof LocalDate) {
                    dto.setDateEffet((LocalDate) row[7]);
                } else if (row[7] instanceof java.util.Date) {
                    dto.setDateEffet(new Date(((java.util.Date) row[7]).getTime()).toLocalDate());
                }
            }
            
            if (row[8] != null) {
                if (row[8] instanceof Date) {
                    dto.setDateEmission(((Date) row[8]).toLocalDate());
                } else if (row[8] instanceof LocalDate) {
                    dto.setDateEmission((LocalDate) row[8]);
                } else if (row[8] instanceof java.util.Date) {
                    dto.setDateEmission(new Date(((java.util.Date) row[8]).getTime()).toLocalDate());
                }
            }
            
            dto.setPrimeNette(row[9] != null ? Double.parseDouble(row[9].toString()) : null);
            dto.setNomSite(row[10] != null ? row[10].toString() : null);
            
            dtoList.add(dto);
        }

        return dtoList;
    }
}
