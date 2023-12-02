package com.example.demo.jwt;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class FilterConfig {
	
	

	@Bean
    public FilterRegistrationBean jwtFilter() {
        FilterRegistrationBean<JwtTokenFilter> filter= new FilterRegistrationBean();
        filter.setFilter(new JwtTokenFilter());
        
       filter.addUrlPatterns("/api/v1/blog/");
       filter.addUrlPatterns("/foodStall/**");
       filter.addUrlPatterns("/cart/**");
       filter.addUrlPatterns("/menu/**");
       return filter;
    }
}
