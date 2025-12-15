package com.flashinfo.mapper;

import com.flashinfo.dto.Emission500KDHSDto;
import com.flashinfo.entity.Emission500KDHS;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
@Component
public interface Emission500KDHSMapper {

    Emission500KDHSMapper INSTANCE = Mappers.getMapper(Emission500KDHSMapper.class);

    Emission500KDHSDto toDto(Emission500KDHS emission500KDHS);

    default Emission500KDHSDto objectArrayToDto(Object[] row) {
        if (row == null) {
            return null;
        }

        Emission500KDHSDto dto = new Emission500KDHSDto();
        dto.setSource(row[0] != null ? row[0].toString() : null);
        dto.setCompagnie(row[1] != null ? row[1].toString() : null);
        dto.setSegment(row[2] != null ? row[2].toString() : null);
        dto.setPolice(row[3] != null ? row[3].toString() : null);
        dto.setNomClient(row[4] != null ? row[4].toString() : null);
        dto.setProduit(row[5] != null ? row[5].toString() : null);
        dto.setAvenant(row[6] != null ? row[6].toString() : null);
        
        // Conversion sécurisée des dates
        dto.setDateEffet(convertToLocalDate(row[7]));
        dto.setDateEmission(convertToLocalDate(row[8]));
        
        dto.setPrimeNette(row[9] != null ? Double.parseDouble(row[9].toString()) : null);
        dto.setNomSite(row[10] != null ? row[10].toString() : null);
        
        return dto;
    }

    // Helper method for date conversion
    default LocalDate convertToLocalDate(Object dateObject) {
        if (dateObject == null) {
            return null;
        }
        
        if (dateObject instanceof Date) {
            return ((Date) dateObject).toLocalDate();
        } else if (dateObject instanceof LocalDate) {
            return (LocalDate) dateObject;
        } else if (dateObject instanceof java.util.Date) {
            return new Date(((java.util.Date) dateObject).getTime()).toLocalDate();
        }
        
        return null;
    }

    // Map list of Object[] to list of DTOs
    default List<Emission500KDHSDto> objectArrayListToDtoList(List<Object[]> rows) {
        if (rows == null) {
            return new ArrayList<>();
        }

        List<Emission500KDHSDto> dtoList = new ArrayList<>();
        for (Object[] row : rows) {
            dtoList.add(objectArrayToDto(row));
        }
        return dtoList;
    }
}
