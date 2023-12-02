package com.example.demo.responses;

import java.util.List;

import com.example.demo.entities.Cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

	private List<Cart> cartItems;
	private String message;
	private boolean success;
}
