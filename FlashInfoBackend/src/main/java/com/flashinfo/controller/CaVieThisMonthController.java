package com.flashinfo.controller;

import com.flashinfo.dto.CaVieThisMonthDto;
import com.flashinfo.service.CaVieThisMonthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vie-this-month")
public class CaVieThisMonthController {

    @Autowired
    private CaVieThisMonthService service;

    @GetMapping
    public List<CaVieThisMonthDto> getAll() {
        return service.getAll();
    }
}
