package com.example.demo.entities;


import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection="menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Menu {


	@MongoId(FieldType.STRING)
	private String id;
	@NotNull
	private String stallId;
	@NotNull
	private String menuItemName;
	@NotNull
	private int price;
	private String menuItemImage;

	

	

}
