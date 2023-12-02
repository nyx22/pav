package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;



@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private TemplateEngine templateEngine = new TemplateEngine();
    


    @Autowired
    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) 
    {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("freshgrubgetitfast@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
    
    public void sendEmailWithHtmlTemplate(String to, String subject, String templateName, Context context) 
    {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

        try 
        {
            helper.setFrom("freshgrubgetitfast@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
       	} 
        catch (MessagingException e) 
        {
            // Handle exception
        	System.out.print(e);
        }
    }
}