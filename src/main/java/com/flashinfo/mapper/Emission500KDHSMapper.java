package com.flashinfo.mapper;

import com.flashinfo.dto.Emission500KDHSDto;
import com.flashinfo.entity.Emission500KDHS;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface Emission500KDHSMapper {

    Emission500KDHSMapper INSTANCE = Mappers.getMapper(Emission500KDHSMapper.class);

    Emission500KDHSDto toDto(Emission500KDHS emission500KDHS);

    Emission500KDHS toEntity(Emission500KDHSDto emission500KDHSDto);
}
