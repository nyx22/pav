package com.example.demo.services;

import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.entities.User;
import com.example.demo.responses.LoginResponse;

public interface UserService {

	String addUser(UserDTO userDto);

	LoginResponse loginUser(LoginDTO loginDto);
	
	User validateUser(LoginDTO loginDto) throws Exception;

}
