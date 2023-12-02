package com.example.demo.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.entities.User;

public interface UserRepo extends MongoRepository<User, String>{

	Optional<User> findOneByEmailAndPassword(String email, String password);
	User findByEmail(String email);

	
}
