package com.example.demo.entities;


import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartProduct {
	@Id
    private String _id;
	@NotNull
    private String userId;
    private Object item ;
	private int qty;
	private LocalDate date;
    private LocalTime time;
    private Boolean isOrdered = false;
    private  String orderStatus="";
}
