package com.example.demo.responses;

import lombok.AllArgsConstructor;

import com.example.demo.entities.CartProduct;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
	 private List<CartProduct> cartItems;
    private int walletAmount;
    private String message;
    private boolean success;

}