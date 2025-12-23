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
    @Mapping(target = "caDuJour", source = "primeJN")
    @Mapping(target = "caMoisActuel", source = "primetotaleN")
    @Mapping(target = "caMoisAnneePrecedente", source = "primetotaleN1")
    @Mapping(target = "tauxRemplissage", source = "tauxRemplissageN")
    @Mapping(target = "ytdCa", source = "primetotaleYD")
    @Mapping(target = "ytdEvolution", source = "tauxEvolutionYD")
    @Mapping(target = "caMoisPrecedent", source = "primetotaleMPN")
    @Mapping(target = "evolutionMoisPrecedent", source = "tauxEvolutionMP")
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
    
    // Currency/percentage formatting removed: DTO now exposes raw numeric values (BigDecimal)
    
    /**
     * Mappe une liste d'entités vers une liste de DTOs
     */
    List<ChiffreAffairesDto> toDto(List<ChiffreAffaires> entities);
    
    /**
     * Crée un DTO pour le total calculé
     */
    default ChiffreAffairesDto createTotalDto(BigDecimal totalCaDuJour, BigDecimal totalCaMoisActuel, 
                                            BigDecimal totalCaMoisAnneePrecedente, BigDecimal totalYtdCa, 
                                            BigDecimal totalCaMoisPrecedent, BigDecimal tauxRemplissage,
                                            BigDecimal ytdEvolution, BigDecimal evolutionMoisPrecedent) {
        return ChiffreAffairesDto.builder()
            .key("total")
            .type("Total")
            .caDuJour(totalCaDuJour)
            .caMoisActuel(totalCaMoisActuel)
            .caMoisAnneePrecedente(totalCaMoisAnneePrecedente)
            .tauxRemplissage(tauxRemplissage)
            .ytdCa(totalYtdCa)
            .ytdEvolution(ytdEvolution)
            .caMoisPrecedent(totalCaMoisPrecedent)
            .evolutionMoisPrecedent(evolutionMoisPrecedent)
            .build();
    }
}