package com.flashinfo.controller;

import com.flashinfo.dto.ChiffreAffairesDto;
import com.flashinfo.entity.ChiffreAffaires;
import com.flashinfo.service.ChiffreAffaireService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chiffre-affaires")
@CrossOrigin(origins = "http://localhost:3000")
public class ChiffreAffairesController {
    
    @Autowired
    private ChiffreAffaireService chiffreAffaireService;
    
    
    @GetMapping
    public List<ChiffreAffairesDto> getAllWithTotal() {
        return chiffreAffaireService.getChiffreAffairesWithTotal();
    }
    
    @GetMapping("/type/{type}")
    public List<ChiffreAffairesDto> getByType(@PathVariable String type) {
        ChiffreAffaires.TypeAssurance typeAssurance = ChiffreAffaires.TypeAssurance.valueOf(type.toUpperCase());
        return chiffreAffaireService.getByTypeAssurance(typeAssurance);
    }
}