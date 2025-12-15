package com.flashinfo.controller;

import com.flashinfo.dto.CaMensuelNonVieDto;
import com.flashinfo.dto.CaMensuelVieDto;
import com.flashinfo.service.CaMensuelService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class CaNoVieVieMensuelController {

    private final CaMensuelService caMensuelService;

    @GetMapping("/ca-non-vie-mensuel")
    public ResponseEntity<List<CaMensuelNonVieDto>> getCaNonVieMensuel() {
        try {
            List<CaMensuelNonVieDto> caNonVieMensuel = caMensuelService.getCaNonVieMensuel();
            return ResponseEntity.ok(caNonVieMensuel);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/ca-vie-mensuel")
    public ResponseEntity<List<CaMensuelVieDto>> getCaVieMensuel() {
        try {
            List<CaMensuelVieDto> caVieMensuel = caMensuelService.getCaVieMensuel();
            return ResponseEntity.ok(caVieMensuel);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
