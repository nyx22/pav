package com.example.demo.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.entities.User;
import com.example.demo.jwt.JwtTokenUtil;
//import com.example.demo.jwt.JwtTokenUtil;
import com.example.demo.repositories.UserRepo;
import com.example.demo.responses.AuthenticationResponse;
import com.example.demo.responses.LoginResponse;
import com.example.demo.services.UserService;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("api/v1/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private JwtTokenUtil jwtTokenUtil;
//	
	@Autowired
	private UserRepo userRepo;
	
	Logger logger = LoggerFactory.getLogger(UserController.class);



	@PostMapping("/save")
	public String saveUser(@RequestBody UserDTO userDto)
	{
		String email = userDto.getEmail();
		User user1 = userRepo.findByEmail(email);
		if(user1!=null)
		{
			return "Email already registered!";
		}
		else
		{
			userService.addUser(userDto);
			return "Registered Successfully!";
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginDTO loginDto)
	{
		try {
			User user = userService.validateUser(loginDto);
			if (user != null) {
//				Logger logger = LoggerFactory.getLogger(UserController.class);
				logger.info("Login Response: "+loginDto.toString());
				return ResponseEntity.ok(new AuthenticationResponse("Token generated",jwtTokenUtil.generateAccessToken(user)));
//							return ResponseEntity.ok(new LoginResponse( "Login Success",true, user.getRole(), user.get_id()));
			}
			else {
				return new ResponseEntity<>(new LoginResponse("Email not exists", false, null, " "), HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			logger.info("Exception ",e);
			return new ResponseEntity<>(new LoginResponse("Email not exists", false, null, " "), HttpStatus.INTERNAL_SERVER_ERROR);
		}
//		LoginResponse loginResponse = userService.loginUser(loginDto);

	}
	@PostMapping("/loginOAuth")
	public ResponseEntity<?> loginUserOAuth(@RequestBody LoginDTO logindto)
	{
		
		LoginResponse loginResponse =userService.loginUser(logindto);
		return ResponseEntity.ok(loginResponse);
	}
	@GetMapping("/loginOAuth")
	public String secured()
	{
		return "Hello user";
	}
	@GetMapping("/userhome")
	public String userHome()
	{
		return "Welcome user!";
	}
	@GetMapping("/vendorhome")
	public String vendorHome()
	{
		return "Welcome vendor!";
	}
	

}
