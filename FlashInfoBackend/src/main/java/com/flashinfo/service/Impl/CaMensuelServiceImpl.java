package com.flashinfo.service.Impl;

import com.flashinfo.dto.CaMensuelNonVieDto;
import com.flashinfo.dto.CaMensuelVieDto;
import com.flashinfo.mapper.CaMensuelMapper;
import com.flashinfo.repository.CaMensuelRepository;
import com.flashinfo.repository.CaVieMensuelRepository;
import com.flashinfo.service.CaMensuelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaMensuelServiceImpl implements CaMensuelService {

    private final CaMensuelRepository caMensuelRepository;
    private final CaVieMensuelRepository caVieMensuelRepository;
    private final CaMensuelMapper caMensuelMapper;

    @Override
    public List<CaMensuelNonVieDto> getCaNonVieMensuel() {
        List<Object[]> results = caMensuelRepository.getCaNonVieMensuel();
        return caMensuelMapper.objectArrayListToDtoListNonVie(results);
    }

    @Override
    public List<CaMensuelVieDto> getCaVieMensuel() {
        List<Object[]> results = caVieMensuelRepository.getCaVieMensuel();
        return caMensuelMapper.objectArrayListToDtoListVie(results);
    }
}