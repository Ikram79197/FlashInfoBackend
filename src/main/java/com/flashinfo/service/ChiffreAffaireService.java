package com.flashinfo.service;

import java.util.List;

import com.flashinfo.dto.ChiffreAffairesDto;
import com.flashinfo.entity.ChiffreAffaires;

public interface ChiffreAffaireService {
    public List<ChiffreAffairesDto> getChiffreAffairesWithTotal();
    public List<ChiffreAffairesDto> getByTypeAssurance(ChiffreAffaires.TypeAssurance type);
}
