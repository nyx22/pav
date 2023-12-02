package com.example.demo.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepo;
import com.example.demo.responses.LoginResponse;
import com.example.demo.services.UserService;

@Service
public class UserImpl implements UserService{
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public String addUser(UserDTO userDto) {
		
		User user = new User(
				userDto.get_id(),
				userDto.getFirstName(),
				userDto.getLastName(),
				userDto.getEmail(),
				userDto.getMobileNumber(),
				this.passwordEncoder.encode(userDto.getPassword()),
				userDto.getRole(),
				userDto.getVendorId(),
				150
		);
		
		userRepo.save(user);
		return user.getFirstName();
	}
	

	@Override
	public LoginResponse loginUser(LoginDTO loginDto) {
		User user1 = userRepo.findByEmail(loginDto.getEmail());
		if(user1 != null) {
			String password = loginDto.getPassword();
			String encodedPassword = user1.getPassword();
			Boolean isPwdRight = passwordEncoder.matches(password,  encodedPassword);
			if(isPwdRight) {
				Optional<User> user = userRepo.findOneByEmailAndPassword(loginDto.getEmail(), encodedPassword);
				if(user.isPresent()) {
					return new LoginResponse( "Login Success",true, user1.getRole(), user1.get_id());
				}else {
					return new LoginResponse("Login Failed" , false, user1.getRole(), " ");
				}
				
			}
			else {
				return new LoginResponse("Password Not Match", false, user1.getRole(), " ");
				
			}
		}
		else {
			return new LoginResponse("Email not exists", false, null, " ");
		}
	}
	
	@Override
	public User validateUser(LoginDTO loginDto) throws Exception {
		User user1 = userRepo.findByEmail(loginDto.getEmail());
		if(user1 != null) {
			String password = loginDto.getPassword();
			String encodedPassword = user1.getPassword();
			Boolean isPwdRight = passwordEncoder.matches(password,  encodedPassword);
			if(isPwdRight) {
				Optional<User> user = userRepo.findOneByEmailAndPassword(loginDto.getEmail(), encodedPassword);
				if(user.isPresent()) {
					return user.get();
				}else {
					throw new Exception("Password is not matched");
				}
				
			}
			else {
				throw new Exception("User email doesn't exist");
				
			}
		}
		else {
			throw new Exception("Not valid");
		}
	}
	


}



