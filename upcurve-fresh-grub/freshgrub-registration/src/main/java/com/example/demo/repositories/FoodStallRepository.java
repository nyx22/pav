package com.example.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.demo.entities.FoodStall;

public interface FoodStallRepository extends MongoRepository<FoodStall, String> {

	Optional<FoodStall> findOneByStallName(String stallName);
	
    @Query(value = "{}", fields = "{ 'stallName' : 1 }")
    List<FoodStall> findStallNamesOnly();
	
}
