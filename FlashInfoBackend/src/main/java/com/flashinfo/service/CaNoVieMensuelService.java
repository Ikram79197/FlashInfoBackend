package com.flashinfo.service;

import com.flashinfo.dto.CaMensuelDto;

import java.util.List;

public interface CaNoVieMensuelService {
    List<CaMensuelDto> getCaNonVieMensuel();
    List<CaMensuelDto> getCaVieMensuel();
}
