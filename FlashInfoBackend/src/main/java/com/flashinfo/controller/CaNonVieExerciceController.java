package com.flashinfo.controller;

import com.flashinfo.dto.CaNonVieExerciceDto;
import com.flashinfo.service.CaNonVieExerciceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ca-non-vie-exercice")
@RequiredArgsConstructor
public class CaNonVieExerciceController {
    private final CaNonVieExerciceService service;

    @GetMapping
    public List<CaNonVieExerciceDto> getAll() {
        return service.getAllCaNonVieExercice();
    }
}
