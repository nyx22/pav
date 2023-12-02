package com.example.demo.responses;

public class AuthenticationResponse {
	String message;
	String token;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public AuthenticationResponse(String message, String token) {
		super();
		this.message = message;
		this.token = token;
	}

}
