package com.flashinfo.mapper;

import com.flashinfo.dto.ChiffreAffairesDto;
import com.flashinfo.entity.ChiffreAffaires;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ChiffreAffairesMapper {
    
    @Mapping(target = "type", source = "typeAssurance", qualifiedByName = "typeToString")
    @Mapping(target = "ca25112025", source = "primeJN", qualifiedByName = "formatCurrency")
    @Mapping(target = "caNov2025", source = "primetotaleN", qualifiedByName = "formatCurrency")
    @Mapping(target = "caNov2024", source = "primetotaleN1", qualifiedByName = "formatCurrency")
    @Mapping(target = "tauxRemplissage", source = "tauxRemplissageN", qualifiedByName = "formatPercentage")
    @Mapping(target = "ytdCa", source = "primetotaleYD", qualifiedByName = "formatCurrency")
    @Mapping(target = "ytdEvolution", source = "tauxEvolutionYD", qualifiedByName = "formatPercentage")
    @Mapping(target = "caOct2025", source = "primetotaleMPN", qualifiedByName = "formatCurrency")
    @Mapping(target = "evolutionOct2025", source = "tauxEvolutionMP", qualifiedByName = "formatPercentage")
    @Mapping(target = "key", source = "typeAssurance", qualifiedByName = "typeToKey")
    ChiffreAffairesDto toDto(ChiffreAffaires entity);
    
    @Named("typeToString")
    default String typeToString(ChiffreAffaires.TypeAssurance type) {
        return type != null ? type.getDisplayName() : null;
    }
    
    @Named("typeToKey")
    default String typeToKey(ChiffreAffaires.TypeAssurance type) {
        if (type == null) return null;
        return switch (type) {
            case NON_VIE -> "non-vie";
            case VIE -> "vie";
            case TOTAL -> "total";
        };
    }
    
    @Named("formatCurrency")
    default String formatCurrency(BigDecimal amount) {
        return ChiffreAffairesDto.formatCurrency(amount);
    }
    
    @Named("formatPercentage")
    default String formatPercentage(BigDecimal percentage) {
        return ChiffreAffairesDto.formatPercentage(percentage);
    }
    
    /**
     * Mappe une liste d'entités vers une liste de DTOs
     */
    List<ChiffreAffairesDto> toDto(List<ChiffreAffaires> entities);
    
    /**
     * Crée un DTO pour le total calculé
     */
    default ChiffreAffairesDto createTotalDto(BigDecimal totalCa25112025, BigDecimal totalCaNov2025, 
                                            BigDecimal totalCaNov2024, BigDecimal totalYtdCa, 
                                            BigDecimal totalCaOct2025, BigDecimal tauxRemplissage,
                                            BigDecimal ytdEvolution, BigDecimal evolutionOct2025) {
        return ChiffreAffairesDto.builder()
            .key("total")
            .type("Total")
            .ca25112025(formatCurrency(totalCa25112025))
            .caNov2025(formatCurrency(totalCaNov2025))
            .caNov2024(formatCurrency(totalCaNov2024))
            .tauxRemplissage(formatPercentage(tauxRemplissage))
            .ytdCa(formatCurrency(totalYtdCa))
            .ytdEvolution(formatPercentage(ytdEvolution))
            .caOct2025(formatCurrency(totalCaOct2025))
            .evolutionOct2025(formatPercentage(evolutionOct2025))
            .build();
    }
}