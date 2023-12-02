package com.example.demo.responses;

import com.example.demo.entities.Menu;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponse {
	private List<Menu> menuItems;
	private String message;
	private boolean success;
}
