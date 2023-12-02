package com.example.demo.responses;

import java.util.List;

import com.example.demo.entities.Cart;
import com.example.demo.entities.CartProduct;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartProductResponse {

	private List<CartProduct> cartItems;
	private String message;
	private boolean success;
}
