package com.flashinfo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CaNonVie {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "BU")
    private String bu;
    
    @Column(name = "AUTO")
    private BigDecimal auto;
    
    @Column(name = "AT")
    private BigDecimal at;
    
    @Column(name = "MALADIE")
    private BigDecimal maladie;
    
    @Column(name = "DIVERS")
    private BigDecimal divers;
    
    @Column(name = "total")
    private BigDecimal total;
}