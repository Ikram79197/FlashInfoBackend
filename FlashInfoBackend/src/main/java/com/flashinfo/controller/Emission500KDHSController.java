package com.flashinfo.controller;

import com.flashinfo.dto.Emission500KDHSDto;
import com.flashinfo.service.Emission500KDHSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/emission500kdhs")
public class Emission500KDHSController {

    @Autowired
    private Emission500KDHSService emission500KDHSService;

    @GetMapping
    public ResponseEntity<List<Emission500KDHSDto>> getEmissions500KDHS() {
        List<Emission500KDHSDto> emissions = emission500KDHSService.getEmissions500KDHS();
        return ResponseEntity.ok(emissions);
    }
}
