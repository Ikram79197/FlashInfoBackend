package com.flashinfo.service.Impl;

import com.flashinfo.dto.CaMensuelDto;
import com.flashinfo.entity.CaNonVieMensuel;
import com.flashinfo.repository.CaNoVieMensuelRepository;
import com.flashinfo.repository.CaNonVieMensuelRepository;
import com.flashinfo.service.CaNoVieMensuelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaMensuelServiceImpl implements CaNoVieMensuelService {

    private final CaNoVieMensuelRepository caMensuelRepository;
    private final CaNonVieMensuelRepository caNonVieMensuelRepository;

    @Override
    public List<CaMensuelDto> getCaNonVieMensuel() {
        List<Object[]> results = caMensuelRepository.getCaVieMensuel();
        
        // Calculer les totaux
        BigDecimal totalAuto = BigDecimal.ZERO;
        BigDecimal totalAt = BigDecimal.ZERO;
        BigDecimal totalMaladie = BigDecimal.ZERO;
        BigDecimal totalDivers = BigDecimal.ZERO;
        
        BigDecimal totalObjAuto = BigDecimal.ZERO;
        BigDecimal totalObjAt = BigDecimal.ZERO;
        BigDecimal totalObjMaladie = BigDecimal.ZERO;
        BigDecimal totalObjDivers = BigDecimal.ZERO;
        
        List<CaMensuelDto> dtoList = new ArrayList<>();
        NumberFormat frenchFormat = NumberFormat.getInstance(Locale.FRANCE);
        frenchFormat.setMinimumFractionDigits(2);
        frenchFormat.setMaximumFractionDigits(2);
        
        for (Object[] result : results) {
            String bu = (String) result[0];
            BigDecimal auto = (BigDecimal) result[1];
            BigDecimal objAuto = (BigDecimal) result[2];
            BigDecimal at = (BigDecimal) result[3];
            BigDecimal objAt = (BigDecimal) result[4];
            BigDecimal maladie = (BigDecimal) result[5];
            BigDecimal objMaladie = (BigDecimal) result[6];
            BigDecimal divers = (BigDecimal) result[7];
            BigDecimal objDivers = (BigDecimal) result[8];
            
            // Accumuler les totaux
            totalAuto = totalAuto.add(auto != null ? auto : BigDecimal.ZERO);
            totalAt = totalAt.add(at != null ? at : BigDecimal.ZERO);
            totalMaladie = totalMaladie.add(maladie != null ? maladie : BigDecimal.ZERO);
            totalDivers = totalDivers.add(divers != null ? divers : BigDecimal.ZERO);
            
            totalObjAuto = totalObjAuto.add(objAuto != null ? objAuto : BigDecimal.ZERO);
            totalObjAt = totalObjAt.add(objAt != null ? objAt : BigDecimal.ZERO);
            totalObjMaladie = totalObjMaladie.add(objMaladie != null ? objMaladie : BigDecimal.ZERO);
            totalObjDivers = totalObjDivers.add(objDivers != null ? objDivers : BigDecimal.ZERO);
            
            // Calculer les taux de remplissage
            BigDecimal tauxAuto = calculateTaux(auto, objAuto);
            BigDecimal tauxAt = calculateTaux(at, objAt);
            BigDecimal tauxMaladie = calculateTaux(maladie, objMaladie);
            BigDecimal tauxDivers = calculateTaux(divers, objDivers);
            
            BigDecimal total = auto.add(at).add(maladie).add(divers);
            BigDecimal objTotal = (objAuto != null ? objAuto : BigDecimal.ZERO)
                .add(objAt != null ? objAt : BigDecimal.ZERO)
                .add(objMaladie != null ? objMaladie : BigDecimal.ZERO)
                .add(objDivers != null ? objDivers : BigDecimal.ZERO);
            BigDecimal tauxTotal = calculateTaux(total, objTotal);
            
            CaMensuelDto dto = CaMensuelDto.createFromBuData(bu, auto, at, maladie, divers);
            dto.setTauxRemplissageAuto(frenchFormat.format(tauxAuto) + " %");
            dto.setTauxRemplissageAt(frenchFormat.format(tauxAt) + " %");
            dto.setTauxRemplissageMaladie(frenchFormat.format(tauxMaladie) + " %");
            dto.setTauxRemplissageDivers(frenchFormat.format(tauxDivers) + " %");
            dto.setTauxRemplissageTotal(frenchFormat.format(tauxTotal) + " %");
            
            dtoList.add(dto);
        }
        
        // Ajouter la ligne de total
        CaMensuelDto totalDto = CaMensuelDto.createFromBuData("Total", totalAuto, totalAt, totalMaladie, totalDivers);
        
        BigDecimal tauxTotalAuto = calculateTaux(totalAuto, totalObjAuto);
        BigDecimal tauxTotalAt = calculateTaux(totalAt, totalObjAt);
        BigDecimal tauxTotalMaladie = calculateTaux(totalMaladie, totalObjMaladie);
        BigDecimal tauxTotalDivers = calculateTaux(totalDivers, totalObjDivers);
        
        BigDecimal grandTotal = totalAuto.add(totalAt).add(totalMaladie).add(totalDivers);
        BigDecimal grandObjTotal = totalObjAuto.add(totalObjAt).add(totalObjMaladie).add(totalObjDivers);
        BigDecimal tauxGrandTotal = calculateTaux(grandTotal, grandObjTotal);
        
        totalDto.setTauxRemplissageAuto(frenchFormat.format(tauxTotalAuto) + " %");
        totalDto.setTauxRemplissageAt(frenchFormat.format(tauxTotalAt) + " %");
        totalDto.setTauxRemplissageMaladie(frenchFormat.format(tauxTotalMaladie) + " %");
        totalDto.setTauxRemplissageDivers(frenchFormat.format(tauxTotalDivers) + " %");
        totalDto.setTauxRemplissageTotal(frenchFormat.format(tauxGrandTotal) + " %");
        
        dtoList.add(totalDto);

        return dtoList;
    }
    
    private BigDecimal calculateTaux(BigDecimal actual, BigDecimal objective) {
        if (objective == null || objective.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        if (actual == null) {
            return BigDecimal.ZERO;
        }
        return actual.multiply(BigDecimal.valueOf(100))
                .divide(objective, 2, RoundingMode.HALF_UP);
    }

    @Override
    public List<CaMensuelDto> getCaVieMensuel() {
        List<Object[]> results = caMensuelRepository.getCaVieMensuel();
        
        return results.stream().map(result -> {
            String bu = (String) result[0];
            BigDecimal auto = (BigDecimal) result[1];
            BigDecimal at = (BigDecimal) result[2];
            BigDecimal maladie = (BigDecimal) result[3];
            BigDecimal divers = (BigDecimal) result[4];
            
            return CaMensuelDto.createFromBuData(bu, auto, at, maladie, divers);
        }).collect(Collectors.toList());
    }
}
