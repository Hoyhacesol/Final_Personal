package com.sports.kickauction.entity; // Recommended package for entities

import java.time.LocalDateTime; // JPA annotations

import jakarta.persistence.Column; // Lombok annotations
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import lombok.ToString;

@Entity // Specifies that this class is an entity
@Table(name = "`ORDER`")
@Setter
@ToString
@Getter
@NoArgsConstructor // Lombok: Generates a no-argument constructor
@AllArgsConstructor // Lombok: Generates an all-argument constructor
@Builder // Lombok: Provides a builder pattern for object creation
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ono")
    private int ono;

    @Column(name = "mno", nullable = false)
    private int mno;

    @Column(name = "play_type", length = 50, nullable = false)
    private String playType;

    @Column(name = "olocation", length = 100, nullable = false)
    private String olocation;

    @Column(name = "rental_date", columnDefinition = "DATETIME")
    private LocalDateTime rentalDate;

    @Column(name = "rental_time", length = 50)
    private String rentalTime;

    @Column(name = "person")
    private Integer person;

    @Column(name = "rental_equipment", columnDefinition = "TEXT")
    private String rentalEquipment;

    @Column(name = "ocontent", columnDefinition = "TEXT")
    private String ocontent;

    @Column(name = "oregdate", columnDefinition = "DATETIME", nullable = false, updatable = false)
    private LocalDateTime regdate;

    @Column(name = "finished", nullable = false)
    private int finished;

}