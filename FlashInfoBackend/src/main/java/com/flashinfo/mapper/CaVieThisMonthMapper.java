package com.flashinfo.mapper;

import com.flashinfo.entity.CaVieThisMonth;
import com.flashinfo.dto.CaVieThisMonthDto;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CaVieThisMonthMapper {
    CaVieThisMonthDto toDto(CaVieThisMonth entity);
    CaVieThisMonth toEntity(CaVieThisMonthDto dto);
    List<CaVieThisMonthDto> toDtoList(List<CaVieThisMonth> entities);
}
