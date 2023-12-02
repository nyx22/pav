
package com.example.demo.repositories;

import java.util.List;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.demo.entities.Cart;

public interface CartRepo extends MongoRepository<Cart, String>{
	
	 Optional<Cart> findOneByUserIdAndItemId(String userId, String itemId);

	Optional<List<Cart>> findAllByUserId(String userId);

	 @Query("{'userId': ?0, 'itemId': ?1, 'isOrdered': ?2}")
	 Optional<Cart> isCartItem(String userId, String itemId, Boolean notOrdered);
	 
	 Optional<Cart> findOneByItemId(String itemId);
	@Aggregation(pipeline  = {
	"{$match: { userId: ?0}}",
	"{$group: { _id: '', total: {$sum: $qty}}}"
	})
	int sumOfQty(String userId);
	Optional<List<Cart>> findByUserIdAndIsOrderedFalse(String userId);
	Optional<List<Cart>> findByDateAndIsOrderedTrue(LocalDate date);
	Optional<List<Cart>> findByDate(LocalDate date);
	
	//List<Cart> findByItemIdAndIsOrdered(String itemId, boolean isOrdered);
	Optional<List<Cart>> findByItemIdAndIsOrderedTrue(String itemId);

	Optional<Cart> findBy_idAndIsOrderedTrue(String id);
	
	Optional<List<Cart>> findByItemId(String itemId);

	long countByIsOrderedAndOrderStatus(boolean isOrdered,String status);

	//	@Query("{'isOrdered': true, 'orderStatus': {$ne: 'OrderTaken'}}")
	//	long countItemsOrderedAndNotTaken();
	@Query(value = "{'isOrdered': true, 'orderStatus': {$ne: 'Order Delivered'}}", count = true)
	long countItemsOrderedAndNotTaken();
	
}