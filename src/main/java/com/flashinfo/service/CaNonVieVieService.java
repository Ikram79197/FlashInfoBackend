package com.flashinfo.service;

import com.flashinfo.dto.CaNonVieVieDto;

import java.util.List;

public interface CaNonVieVieService {
    List<CaNonVieVieDto> getAllCaNonVieVie();
    List<CaNonVieVieDto> getCaVie();
    List<CaNonVieVieDto> getCaNonVie();
}