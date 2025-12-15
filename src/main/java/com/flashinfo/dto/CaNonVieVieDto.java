package com.flashinfo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaNonVieVieDto {
    
    @JsonProperty("bu")
    private String bu;
    
    @JsonProperty("auto")
    private BigDecimal auto;
    
    @JsonProperty("at")
    private BigDecimal at;
    
    @JsonProperty("maladie")
    private BigDecimal maladie;
    
    @JsonProperty("divers")
    private BigDecimal divers;
    
    @JsonProperty("vie")
    private BigDecimal vie;
    
    @JsonProperty("total")
    private BigDecimal total;
}