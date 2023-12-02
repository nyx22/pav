package com.example.demo.entities;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection  = "users")
public class User {
	
	@Id
	private String _id;
	@NotNull
	private String firstName;
	private String lastName;
	@NotNull
	private String email;
	@NotNull
	private long mobileNumber;
	@NotNull
	private String password;
	@NotNull
	private String role;
	private String vendorID;
    private int wallet;
}
