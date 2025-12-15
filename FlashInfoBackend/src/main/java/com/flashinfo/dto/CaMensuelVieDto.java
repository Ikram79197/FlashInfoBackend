package com.flashinfo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaMensuelVieDto {
    
    @JsonProperty("mutuelle")
    private String mutuelle;
    
    @JsonProperty("capitalisation")
    private String capitalisation;
    
    @JsonProperty("tauxRemplissageCapitalisation")
    private String tauxRemplissageCapitalisation;
    
    @JsonProperty("retraite")
    private String retraite;
    
    @JsonProperty("tauxRemplissageRetraite")
    private String tauxRemplissageRetraite;
    
    @JsonProperty("deces")
    private String deces;
    
    @JsonProperty("tauxRemplissageDeces")
    private String tauxRemplissageDeces;
    
    @JsonProperty("total")
    private String total;
    
    @JsonProperty("tauxRemplissageTotal")
    private String tauxRemplissageTotal;
}
