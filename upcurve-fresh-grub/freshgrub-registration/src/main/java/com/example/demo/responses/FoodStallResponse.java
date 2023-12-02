package com.example.demo.responses;

import com.example.demo.entities.FoodStall;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodStallResponse {
	 private List<FoodStall> foodStalls;
	 private String message;
	 private boolean success;
}
