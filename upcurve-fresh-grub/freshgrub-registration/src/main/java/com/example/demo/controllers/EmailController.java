package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.repositories.UserRepo;
import com.example.demo.services.EmailService;

@RestController
@RequestMapping("/user/{userId}")
public class EmailController {

    private final EmailService emailService;
    
	@Autowired
	private UserRepo userRepo;
	
    @Autowired
    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-email")
    public String sendEmail(@PathVariable String userId) {
    	String email = userRepo.findById(userId).get().getEmail();
        emailService.sendEmail(email,"Order Ready", "No more wait! Your order is ready to be picked up. Thank you for ordering from us. Have a good day!");
        return "Email sent successfully!";
    }
}