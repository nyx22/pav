package com.example.demo.services;

import java.io.IOException;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.entities.FoodStall;
import com.example.demo.repositories.FoodStallRepository;
import com.example.demo.responses.FoodStallResponse;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FoodStallService {
	
	    private final MongoTemplate mongoTemplate;
	    
	    @Autowired
		FoodStallRepository foodStallRepo;

	    //dependency injection
	    public FoodStallService(MongoTemplate mongoTemplate) {
	        this.mongoTemplate = mongoTemplate;
	    }
	    

		public ResponseEntity<FoodStallResponse> getAllStalls() {
			FoodStallResponse response = new FoodStallResponse();
			response.setMessage("Successfully fetched");
			response.setSuccess(true);
			List<FoodStall> foodStalls = mongoTemplate.findAll(FoodStall.class);
			response.setFoodStalls(foodStalls);
		    return ResponseEntity.ok(response);
		}


	public ResponseEntity<FoodStallResponse> createFoodStall(String name, String description,String image) {

		FoodStallResponse response = new FoodStallResponse();
		Optional<FoodStall> existingFoodStall = foodStallRepo.findOneByStallName(name);
		FoodStall foodStall = new FoodStall();

		if(existingFoodStall.isPresent())
		{
			response.setMessage("Food Stall Already Exists by this name");
			response.setSuccess(false);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
		foodStall.setStallName(name);;
		if(image!=null && !image.isEmpty()) {
//			if(StringUtils.cleanPath(Objects.requireNonNull(image.getOriginalFilename())).contains(".."))
//			{
//				response.setMessage("Invalid Image");
//				response.setSuccess(false);
//				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//			}
			try {
				foodStall.setStallImage(image);
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}else{
			foodStall.setStallImage(null);
		}
		
		System.out.println("Category: " + foodStall.getStallImage());
		foodStall.setStallName(name);
		foodStall.setDescription(description);
		FoodStall saved = mongoTemplate.insert(foodStall);
		response.setFoodStalls(Collections.singletonList(saved));
		response.setMessage("Successfully inserted");
		response.setSuccess(true);
		return ResponseEntity.ok(response);

	}

		public ResponseEntity<FoodStallResponse> deleteFoodStall(String id) {
			Optional<FoodStall> foodStall = foodStallRepo.findById(id);
			FoodStallResponse response = new FoodStallResponse();
			if(foodStall.isPresent())
			{
				foodStallRepo.delete(foodStall.get());
				response.setMessage("Successfully Deleted");
				response.setSuccess(true);
				return ResponseEntity.status(HttpStatus.OK).body(response);
			}
			else
			{
				response.setMessage("Food Stall Not found");
				response.setSuccess(false);
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}
		}

	public ResponseEntity<FoodStallResponse> editFoodStall(String id, String name, String description, String image) {

		FoodStall foodStall = new FoodStall();
		FoodStallResponse response = new FoodStallResponse();
		Optional<FoodStall> existingFoodStall = foodStallRepo.findById(id);
		if(existingFoodStall.isPresent())
		{
			foodStall.setId(id);
			Optional<FoodStall> existingFoodStallByName = foodStallRepo.findOneByStallName(name);
			if(existingFoodStallByName.isPresent() && !existingFoodStallByName.get().getId().equals(id))
			{
				response.setMessage("Food Stall Already Exists by this name");
				response.setSuccess(false);
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}
			foodStall.setStallName(name);
			foodStall.setDescription(description);
			if(image!=null && !image.isEmpty()) {
//				if(StringUtils.cleanPath(Objects.requireNonNull(image.getOriginalFilename())).contains(".."))
//				{
//					response.setMessage("Invalid Image");
//					response.setSuccess(false);
//					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//				}
				try {
					foodStall.setStallImage(image);
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
			}else{
				foodStall.setStallImage(foodStall.getStallImage());
			}
			mongoTemplate.save(foodStall);
			response.setFoodStalls(Collections.singletonList(foodStall));
			response.setMessage("Successfully Updated");
			response.setSuccess(true);
			return ResponseEntity.ok(response);
		}
		response.setMessage("Food Stall Not found");
		response.setSuccess(false);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

		
}
	

