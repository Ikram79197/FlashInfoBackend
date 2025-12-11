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
@AllArgsConstructor
@NoArgsConstructor
public class CaNonVieVie {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "type_assurance")
    private String typeAssurance;

    @Column(name = "mutuelle")
    private String mutuelle;

    @Column(name = "Code_branche")
    private String codeBranche;

    @Column(name = "ca_j_moins_1")
    private BigDecimal caJMoins1;


}