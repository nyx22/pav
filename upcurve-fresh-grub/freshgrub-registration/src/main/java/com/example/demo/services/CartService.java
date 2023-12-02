
package com.example.demo.services;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Cart;
import com.example.demo.entities.CartProduct;
import com.example.demo.repositories.CartRepo;
import com.example.demo.repositories.MenuRepository;
import com.example.demo.responses.CartProductResponse;
import com.example.demo.responses.CartResponse;

@Service
public class CartService {
	private final MongoTemplate mongoTemplate;

	@Autowired
	CartRepo cartRepo;

	@Autowired
	MenuRepository menuRepo;

	public CartService(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	public ResponseEntity<CartResponse> addCartItem(String userId, String itemId, int qty, Boolean isOrdered) {
		CartResponse response = new CartResponse();
		if(isOrdered==false)
		{
			Optional<Cart> existingCart = cartRepo.isCartItem(userId, itemId, isOrdered);
			if(existingCart.isPresent()) 
			{

				/*
				 * Query query = new Query();
				 * 
				 * query.addCriteria(Criteria.where("userId").is(userId).and("itemId").is(itemId
				 * ).and("isOrdered").is(false)); Cart cartItem = mongoTemplate.findOne(query,
				 * Cart.class);
				 */
				Cart cartItem1 = existingCart.get();
				//if(cartItem!=null)
				//{
					int oldQty = cartItem1.getQty();
					int newQty = oldQty + 1;
					cartItem1.setQty(newQty);
					cartRepo.save(cartItem1);
					response.setCartItems(Collections.singletonList(cartItem1));
					response.setMessage("Successfully Increased Quantity");
					response.setSuccess(true);
					return ResponseEntity.status(HttpStatus.OK).body(response);
				//}
			}
		}
		else if(isOrdered==true)
		{		
			Optional<Cart> existingCart = cartRepo.isCartItem(userId, itemId, isOrdered);
			if(existingCart.isPresent()) 
			{

				/*
				 * Query query = new Query();
				 * 
				 * query.addCriteria(Criteria.where("userId").is(userId).and("itemId").is(itemId
				 * ).and("isOrdered").is(false)); Cart cartItem = mongoTemplate.findOne(query,
				 * Cart.class);
				 */
				Cart cartItem = existingCart.get();
				//if(cartItem!=null)
				//{
					int oldQty = cartItem.getQty();
					int newQty = oldQty + 1;
					cartItem.setQty(newQty);
					cartRepo.save(cartItem);
					response.setCartItems(Collections.singletonList(cartItem));
					response.setMessage("Successfully Increased Quantity");
					response.setSuccess(true);
					return ResponseEntity.status(HttpStatus.OK).body(response);
				//}
			}
		}
		Cart cartItem = new Cart();
		cartItem.setUserId(userId);
		cartItem.setItemId(itemId);
		cartItem.setQty(qty);
		cartItem.setIsOrdered(isOrdered);

		mongoTemplate.insert(cartItem);
		response.setCartItems(Collections.singletonList(cartItem));
		response.setMessage("Successfully added item to cart");
		response.setSuccess(true);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	public ResponseEntity<CartResponse> decrementCartItem(String userId, String itemId) {
		CartResponse response = new CartResponse();
		Optional<Cart> existingCart = cartRepo.isCartItem(userId, itemId, false);
		if (existingCart.isPresent()) {

			//Query query = new Query();
			//query.addCriteria(Criteria.where("itemId").is(itemId));
			//Cart cartItem = mongoTemplate.findOne(query, Cart.class);
			Cart cartItem = existingCart.get();
			int oldQty = cartItem.getQty();
			if (oldQty > 1)// decrement the quantity
			{
				int newQty = oldQty - 1;
				cartItem.setQty(newQty);
				cartRepo.save(cartItem);
				response.setMessage("Successfully reduced Quantity");
				response.setSuccess(true);
				return ResponseEntity.status(HttpStatus.OK).body(response);
			} else if (oldQty == 1)// remove the item document from the collection
			{
				cartRepo.delete(cartItem);
				response.setMessage("Successfully removed item");
				response.setSuccess(true);
				return ResponseEntity.status(HttpStatus.OK).body(response);
			} else {
				response.setMessage("Item is not in the cart");
				response.setSuccess(false);
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

		}
		response.setMessage("Item not in cart");
		response.setSuccess(false);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}
	public ResponseEntity<CartResponse> removeCartItem(String userId, String itemId) 
	{
		CartResponse response = new CartResponse();
		Optional<Cart> existingCart = cartRepo.isCartItem(userId, itemId, false);
		if (existingCart.isPresent()) 
		{
			//Query query = new Query();
			//query.addCriteria(Criteria.where("userId").is(userId).and("itemId").is(itemId));
			//Cart cartItem = mongoTemplate.findOne(query, Cart.class);
			Cart cartItem = existingCart.get();
			cartRepo.delete(cartItem);
			response.setMessage("Successfully removed item");
			response.setSuccess(true);
			return ResponseEntity.status(HttpStatus.OK).body(response);
		} 
		response.setMessage("Item not in cart");
		response.setSuccess(false);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	

	
	  public ResponseEntity<CartProductResponse> getAllCartItems(String userId) { 
		  CartProductResponse response = new CartProductResponse(); 
		  response.setMessage("Successfully fetched");
	      response.setSuccess(true);
	  
	  
		/*
		 * Query query = new Query();
		 * query.addCriteria(Criteria.where("isOrdered").is(false)); List<Cart>
		 * cartItems = mongoTemplate.find(query, Cart.class);
		 */
	  
	  
	  LookupOperation lookup =
	  LookupOperation.newLookup().from("menu_items").localField("itemId").
	  foreignField("_id").as("item");
	  
	  Aggregation aggregation =  Aggregation.newAggregation(Aggregation.match(Criteria.where("userId").is(userId).andOperator(Criteria.where("isOrdered").is(false))), lookup );
	  
	  List<CartProduct> cartItems = mongoTemplate.aggregate(aggregation, "cart", CartProduct.class).getMappedResults(); 
	  response.setCartItems(cartItems); 
	  return ResponseEntity.ok(response);
	  
	  }
	 
	  public int getSumOfQty(String userId)
	  {
		  int sum = cartRepo.sumOfQty(userId);
		  return sum;
	  }
	  public int getQtyByItemId(String userId, String itemId)
	  {
		  int sum = cartRepo.sumOfQty(userId);
		  return sum;
	  }

	
	/*
	 * public List<CartProduct> getAllCartItems() { LookupOperation lookupOperation
	 * = LookupOperation.newLookup().from("menu_items").localField("itemId")
	 * .foreignField("_id").as("item");
	 * 
	 * Aggregation aggregation = Aggregation.newAggregation(lookupOperation);
	 * 
	 * AggregationResults<CartProduct> results =
	 * mongoTemplate.aggregate(aggregation, "cart", CartProduct.class);
	 * 
	 * return results.getMappedResults(); }
	 */
	 

}


