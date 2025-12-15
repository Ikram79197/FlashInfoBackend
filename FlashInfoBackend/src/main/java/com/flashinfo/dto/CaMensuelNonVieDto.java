package com.flashinfo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaMensuelNonVieDto {
    
    @JsonProperty("bu")
    private String bu;
    
    @JsonProperty("auto")
    private String auto;
    
    @JsonProperty("tauxRemplissageAuto")
    private String tauxRemplissageAuto;
    
    @JsonProperty("at")
    private String at;
    
    @JsonProperty("tauxRemplissageAt")
    private String tauxRemplissageAt;
    
    @JsonProperty("maladie")
    private String maladie;
    
    @JsonProperty("tauxRemplissageMaladie")
    private String tauxRemplissageMaladie;
    
    @JsonProperty("divers")
    private String divers;
    
    @JsonProperty("tauxRemplissageDivers")
    private String tauxRemplissageDivers;
    
    @JsonProperty("total")
    private String total;
    
    @JsonProperty("tauxRemplissageTotal")
    private String tauxRemplissageTotal;
}
