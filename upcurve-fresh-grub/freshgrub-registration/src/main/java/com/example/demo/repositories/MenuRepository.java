package com.example.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.demo.entities.FoodStall;
import com.example.demo.entities.Menu;

public interface MenuRepository extends MongoRepository<Menu, String>{
	
	Optional<Menu> findOneByMenuItemName(String menuItemName);
	
	 @Query("{'stallId': ?0}")
	 List<Menu> findMenuItemsByStallId(String stallId);
	 
	 @Query(value = "{}", fields = "{'stallName' : 1}")
	 List<FoodStall> findAllDistinctStallNames();

}
