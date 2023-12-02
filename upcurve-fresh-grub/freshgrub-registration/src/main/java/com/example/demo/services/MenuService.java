package com.example.demo.services;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Cart;
import com.example.demo.entities.Menu;
import com.example.demo.repositories.CartRepo;
import com.example.demo.repositories.MenuRepository;
import com.example.demo.responses.MenuResponse;

@Service
public class MenuService {


	private final MongoTemplate mongoTemplate;

	@Autowired
	MenuRepository menuRepository;
	
	@Autowired
	CartRepo cartRepo;

	public MenuService(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}
	
	public ResponseEntity<MenuResponse> addMenuItem(String stallId, String menuItemName, int price, String image) 
	{
		MenuResponse response = new MenuResponse();
		Optional<Menu> existingMenu= menuRepository.findOneByMenuItemName(menuItemName);
		Menu menuItem = new Menu();
		menuItem.setStallId(stallId);
		if(existingMenu.isPresent()) 
		{
			response.setMessage("Food Item Already Exists");
			response.setSuccess(false);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
		menuItem.setMenuItemName(menuItemName);
		menuItem.setPrice(price);
		if(image!=null && !image.isEmpty()) {

			try {
				menuItem.setMenuItemImage(image);
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}else{
			menuItem.setMenuItemImage(null);
		}
		
		System.out.println("menuItem: " + menuItem.getMenuItemImage());

		mongoTemplate.insert(menuItem);
		response.setMenuItems(Collections.singletonList(menuItem));
		response.setMessage("Successfully inserted");

		return ResponseEntity.ok(response);
	}

	public ResponseEntity<MenuResponse> getMenuItems(String foodStallId) {
		List<Menu> menuItems = menuRepository.findMenuItemsByStallId(foodStallId);
		MenuResponse response = new MenuResponse();

		if (menuItems.isEmpty()) {
			response.setMessage("No Menu Items Found");
			response.setSuccess(false);
			return ResponseEntity.status(HttpStatus.OK).body(response);
        }

		response.setMenuItems(menuItems);
		response.setMessage("Menu Items Found");
		response.setSuccess(true);

        return ResponseEntity.ok(response);
	}
	
	public ResponseEntity<Menu> getSingleMenuItem(String foodStallId, String id){
		List<Menu> menuItems = menuRepository.findMenuItemsByStallId(foodStallId);
		System.out.println("menuItems: " + menuItems.size());
		Menu menu = new Menu();
		System.out.println("id: "+id);
		if (menuItems.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(menu);
        }

		else {
			for (Menu obj : menuItems) {
	            if(obj.getId().equals(id)) {
	            	menu = obj;
	            	break;
	            };
	        }
		 System.out.println("menuDetails: "+ menu.getMenuItemName());
        return ResponseEntity.ok(menu);
		}
		 
	}

	public ResponseEntity<MenuResponse> editMenuItem(String id, String menuItemName, int price, String image) {
		MenuResponse response = new MenuResponse();
		Optional<Menu> existingMenu= menuRepository.findById(id);
		if(existingMenu.isEmpty())
		{
			response.setMessage("Item Not found");
			response.setSuccess(false);
			return ResponseEntity.status(HttpStatus.OK).body(response);
		}
		//check if the menu item name is already present
//		Optional<Menu> existingMenuItem = menuRepository.findOneByMenuItemName(menuItemName);
		else if(existingMenu.isPresent() && existingMenu.get().getId().equals(id)) {
			Menu menu = existingMenu.get();
			menu.setMenuItemName(menuItemName);
			menu.setPrice(price);
			if(image != null) {
				menu.setMenuItemImage(image);
			}
			System.out.println("Menu Item: " + menu);
			menuRepository.save(menu);
			response.setMenuItems(Collections.singletonList(menu));
			response.setMessage("Food Item Updated successfully");
			response.setSuccess(true);
			return ResponseEntity.ok(response);
		} else {
			response.setMessage("No Item Exists");
			response.setSuccess(false);
			return ResponseEntity.ok(response);
		}

	}

	public ResponseEntity<MenuResponse> deleteMenuItem(String id) {
		Optional<Menu> menuItem = menuRepository.findById(id);
		MenuResponse response = new MenuResponse();

		Optional<List<Cart>> existingCart = cartRepo.findByItemId(id);
		if (existingCart.isPresent()) {
			for (Cart item : existingCart.get()) {
				String itemId = item.getItemId();
				Query query = new Query();
				query.addCriteria(Criteria.where("itemId").is(itemId));
				mongoTemplate.remove(query, Cart.class); 
			}
		}

		if(menuItem.isPresent())
		{
			menuRepository.deleteById(id);
			response.setMessage("Menu Item Deleted");
			response.setSuccess(true);
			return ResponseEntity.ok(response);
		}
		else
		{
			response.setMessage("Menu Item Not Found");
			response.setSuccess(false);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
	}


}
