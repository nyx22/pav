package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.CategoryPayload;
import com.example.demo.responses.FoodStallResponse;

@RestController
@RequestMapping("/foodStall")
public class FoodStallController {
	
	@Autowired
	com.example.demo.services.FoodStallService foodStallService;
	
	@GetMapping("/getAllStalls")
	public ResponseEntity<FoodStallResponse> getAllFoodStalls()
	{	
		return foodStallService.getAllStalls();
	}

	@PostMapping("/create")
	public ResponseEntity<FoodStallResponse> createFoodStall(@RequestBody CategoryPayload categoryPayload){

		return foodStallService.createFoodStall(categoryPayload.getName(), categoryPayload.getDescription(), categoryPayload.getImage());
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<FoodStallResponse> deleteFoodStall(@PathVariable String id){
		return foodStallService.deleteFoodStall(id);
	}

	@PatchMapping("/edit/{id}")
	public  ResponseEntity<FoodStallResponse> editFoodStall(@PathVariable String id,
															@RequestParam("name") String name,
															@RequestParam("description") String description,
															@RequestParam(name="image", required = true) String image){
		return foodStallService.editFoodStall(id, name, description, image);
	}
	
	
}
