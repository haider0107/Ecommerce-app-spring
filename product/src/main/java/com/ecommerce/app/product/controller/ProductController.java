package com.ecommerce.app.product.controller;

import com.ecommerce.app.product.dto.ApiResponse;
import com.ecommerce.app.product.dto.ProductRequest;
import com.ecommerce.app.product.dto.ProductResponse;
import com.ecommerce.app.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/simulate")
    public ResponseEntity<String> simulateFailure(
            @RequestParam(defaultValue = "false") boolean fail) {
        if (fail) {
            throw new RuntimeException("Simulated Failure For Testing");
        }
        return ResponseEntity.ok("Product Service is OK");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestBody ProductRequest productRequest) {

        ProductResponse response = productService.createProduct(productRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<ProductResponse>builder()
                        .success(true)
                        .status(201)
                        .message("Product created successfully")
                        .data(response)
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProducts() {

        List<ProductResponse> products = productService.getAllProducts();

        return ResponseEntity.ok(
                ApiResponse.<List<ProductResponse>>builder()
                        .success(true)
                        .status(200)
                        .message("Products fetched successfully")
                        .data(products)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
            @PathVariable String id) {

        ProductResponse product = productService.getProductById(id);

        return ResponseEntity.ok(
                ApiResponse.<ProductResponse>builder()
                        .success(true)
                        .status(200)
                        .message("Product fetched successfully")
                        .data(product)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest productRequest) {

        ProductResponse updatedProduct =
                productService.updateProduct(id, productRequest);

        return ResponseEntity.ok(
                ApiResponse.<ProductResponse>builder()
                        .success(true)
                        .status(200)
                        .message("Product updated successfully")
                        .data(updatedProduct)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .status(200)
                        .message("Product deleted successfully")
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(
            @RequestParam String keyword) {

        List<ProductResponse> results = productService.searchProducts(keyword);

        return ResponseEntity.ok(
                ApiResponse.<List<ProductResponse>>builder()
                        .success(true)
                        .status(200)
                        .message("Search completed successfully")
                        .data(results)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
}
