package com.flashinfo.service;

import com.flashinfo.dto.CaMensuelNonVieDto;
import com.flashinfo.dto.CaMensuelVieDto;

import java.util.List;

public interface CaMensuelService {
    List<CaMensuelNonVieDto> getCaNonVieMensuel();
    List<CaMensuelVieDto> getCaVieMensuel();
}
