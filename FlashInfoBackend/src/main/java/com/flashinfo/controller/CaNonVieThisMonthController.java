package com.flashinfo.controller;

import com.flashinfo.dto.CaNonVieThisMonthDto;
import com.flashinfo.service.CaNonVieThisMonthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ca-non-vie-this-month")
@RequiredArgsConstructor
public class CaNonVieThisMonthController {
    private final CaNonVieThisMonthService service;

    @GetMapping
    public List<CaNonVieThisMonthDto> getAll() {
        return service.getAllCaNonVieThisMonth();
    }
}
