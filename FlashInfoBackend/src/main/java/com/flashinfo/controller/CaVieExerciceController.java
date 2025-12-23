package com.flashinfo.controller;

import com.flashinfo.dto.CaVieExerciceDto;
import com.flashinfo.service.CaVieExerciceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ca-vie-exercice")
@RequiredArgsConstructor
public class CaVieExerciceController {
    private final CaVieExerciceService service;

    @GetMapping
    public List<CaVieExerciceDto> getAll() {
        return service.getAllCaVieExercice();
    }
}
