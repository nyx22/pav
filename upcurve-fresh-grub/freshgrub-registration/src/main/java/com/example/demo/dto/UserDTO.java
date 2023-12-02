package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
	private String _id;
	private String firstName;
	private String lastName;
	private String email;
	private long mobileNumber;
	private String password;
	private String role;
	private String vendorId;

}
