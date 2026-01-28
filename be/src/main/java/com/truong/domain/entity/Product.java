package com.truong.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "products")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private BigDecimal price;

    private String description;
    private Integer stock;

    private String slug;
    private String shortDescription;
    private String originalPrice;
    private String images;
    private String discount;
    private String categoryId;
    private String weight;
    private String origin;
    private String processingMethod;
    private String details;
    private Boolean isFeatured;
    private Boolean isNew;
    private String metaKeywords;
}
