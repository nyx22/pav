package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.MenuPayload;
import com.example.demo.entities.Menu;
import com.example.demo.responses.MenuResponse;
import com.example.demo.services.MenuService;

@RestController
@RequestMapping("/menu/{foodStallId}")
public class MenuController {

	 @Autowired
	 MenuService menuService;

	@PostMapping(value="/create", consumes={"multipart/form-data"})
	public ResponseEntity<MenuResponse> createMenuItem(@PathVariable String foodStallId,
			@RequestParam("menuItemName") String menuItemName,
			@RequestParam("price")	 int price,
			@RequestParam("menuItemImage") String menuItemImage
			 ) {
//		System.out.println("request: " + menuItemName + " pirce: " + price + "image: " + menuItemImage);
		return menuService.addMenuItem(foodStallId, menuItemName, price, menuItemImage);
	}

	 @GetMapping("")
	 public  ResponseEntity<MenuResponse> getMenuDetails(@PathVariable String foodStallId) {
	       return menuService.getMenuItems(foodStallId);
	 }
	 
	 @GetMapping("/{id}")
	 public  ResponseEntity<Menu> getOneMenuDetails(@PathVariable String foodStallId, @PathVariable String id) {
	       return menuService.getSingleMenuItem(foodStallId, id);
	 }
	 
	 
	 @PatchMapping("/edit/{id}")
		public ResponseEntity<MenuResponse> editMenuItem(@PathVariable String foodStallId, @PathVariable String id, @RequestBody MenuPayload menuPayload
														 ) {
		 System.out.println("item: " + foodStallId + " " + id + "name: " + menuPayload.getMenuItemName());
			return menuService.editMenuItem(id, menuPayload.getMenuItemName(), menuPayload.getPrice(), menuPayload.getMenuItemImage());
//		 System.out.println("item: " + foodStallId + " " + id + "name: " + menuPayload.getMenuItemName());
	 }
	 
//	@PatchMapping("/edit/{id}")
//	public ResponseEntity<MenuResponse> editMenuItem(@PathVariable String foodStallId, @PathVariable String id,
//													 @RequestParam("menuItemName") String menuItemName,
//													 @RequestParam("price") int price,
//													 @RequestParam(required = false) MultipartFile image) {
//		return menuService.editMenuItem(id, menuItemName, price, image);
//	}

	 @DeleteMapping("/delete/{id}")
	 public ResponseEntity<MenuResponse> deleteMenuItem(@PathVariable String id) {
		 return menuService.deleteMenuItem(id);
	 }
}
