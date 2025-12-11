package com.flashinfo.controller;

import com.flashinfo.dto.CaNonVieVieDto;
import com.flashinfo.service.CaNonVieVieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CaNonVieVieController {

    @Autowired
    private CaNonVieVieService caNonVieVieService;

    @GetMapping("/synthese-vie")
    public ResponseEntity<List<CaNonVieVieDto>> getCaVie() {
        List<CaNonVieVieDto> caVie = caNonVieVieService.getCaVie();
        return ResponseEntity.ok(caVie);
    }

    @GetMapping("/synthese-non-vie")
    public ResponseEntity<List<CaNonVieVieDto>> getCaNonVie() {
        List<CaNonVieVieDto> caNonVie = caNonVieVieService.getCaNonVie();
        return ResponseEntity.ok(caNonVie);
    }
}