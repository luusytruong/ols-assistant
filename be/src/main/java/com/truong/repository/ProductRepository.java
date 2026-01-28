package com.truong.repository;

import com.truong.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query("""
                 SELECT p FROM Product p
                 WHERE (:keyword IS NULL\s
                     OR p.name LIKE concat('%', :keyword, '%')\s
                     OR p.description LIKE concat('%', :keyword, '%')
                     OR p.details LIKE concat('%', :keyword, '%')
                     OR p.metaKeywords LIKE concat('%', :keyword, '%'))
                 AND (:minPrice IS NULL OR p.price >= :minPrice)
                 AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            \s""")
    List<Product> search(
            @Param("keyword") String keyword,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice);
}
