package com.example.demo.entities;

import org.springframework.data.mongodb.core.mapping.Document;

import org.springframework.data.annotation.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection="stalls")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodStall {
	
	@Id
	private String id;
	@NotNull
	private String stallName;
	@NotNull
	private String stallImage;
	@NotNull
	private String description;

	
}
