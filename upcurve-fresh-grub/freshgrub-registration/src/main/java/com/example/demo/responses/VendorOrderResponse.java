package com.example.demo.responses;

import com.example.demo.entities.CartProduct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorOrderResponse {

    private List<CartProduct> cartItems;
    private int pageNumber;
    private int currPageSize;
    private long totalElements;
    private int totalPages;
    private boolean lastPage;
    private String message;
    private boolean success;
}
