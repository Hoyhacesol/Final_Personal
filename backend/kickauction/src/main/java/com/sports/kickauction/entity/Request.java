package com.sports.kickauction.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import lombok.ToString;

@Entity
@Table(name = "`ORDER`")
@Setter
@ToString
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ono")
    private int ono;

    // @ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "mno", nullable = false)
    private int mno;

    @Column(name = "otitle", length = 200)
    private String otitle;

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

    @Column(name = "oregdate", columnDefinition = "DATETIME", nullable = false)
    private LocalDateTime oregdate;

    @Column(name = "finished", nullable = false)
    private int finished;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Biz> bizList;

}