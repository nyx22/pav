

package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.responses.CartProductResponse;
import com.example.demo.responses.CartResponse;
import com.example.demo.services.CartService;

@RestController
@RequestMapping("/cart/{userId}")
public class CartController {
	
	@Autowired
	CartService cartService;
	
	@PostMapping(value="/add")
	public ResponseEntity<CartResponse> createCartItem(@PathVariable String userId,
			@RequestParam("itemId") String itemId,
			@RequestParam("qty") int qty,
			@RequestParam("isOrdered") Boolean isOrdered) 
	{
		return cartService.addCartItem(userId, itemId, qty, isOrdered);
	}
	@PostMapping(value="/decrease")
	public ResponseEntity<CartResponse> decrementCartItem(@PathVariable String userId,
			@RequestParam("itemId") String itemId) 
	{
		return cartService.decrementCartItem(userId, itemId);
	}
	
	@PostMapping(value="/remove")
	public ResponseEntity<CartResponse> removeCartItem(@PathVariable String userId,
			@RequestParam("itemId") String itemId) 
	{
		return cartService.removeCartItem(userId, itemId);
	}
	@GetMapping(value="")
	public ResponseEntity<CartProductResponse> getAllCartItems(@PathVariable String userId)
	{
		return cartService.getAllCartItems(userId);
	}
	
	@GetMapping(value="/qty")
	public int getSumOfQty(@PathVariable String userId)
	{
		return cartService.getSumOfQty(userId);
	}
	@GetMapping(value="/itemqty")
	public int getQtyByItemId(@PathVariable String userId, @RequestParam("itemId") String itemId)
	{
		return cartService.getQtyByItemId(userId, itemId);
	}

}


