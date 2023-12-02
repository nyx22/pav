package com.example.demo.jwt;

import java.io.IOException;
import java.util.Enumeration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.GenericFilterBean;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.entities.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Component
public class JwtTokenFilter extends GenericFilterBean {
	@Autowired
	private JwtTokenUtil jwtUtil;
	
	@Value("$authToken.header")
	private String tokenHeader;
	
	private static final String AUTH_HEADER = "Authorization";
	private static final String BEARER_PREFIX = "Bearer ";
	private static final String EXCLUDE = "/api/v1/users/**";




	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		 final HttpServletRequest httpRequest = (HttpServletRequest) request;
		 final HttpServletResponse httpResponse = (HttpServletResponse) response;
		 final String requestURI = httpRequest.getRequestURI();
	   
	    String origin = "*";
	    if(!StringUtils.isBlank(httpRequest.getHeader("origin"))) {
	    	origin = httpRequest.getHeader("origin");
	    }
	    
		 httpResponse.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE, PATCH");
	    httpResponse.setHeader("Access-Control-Allow-Origin", origin);
	    httpResponse.setHeader("Access-Control-Allow-Headers", "Origin, X-Api-Key, X-Auth-Token, Content-Type, Accept, Authorization, Cache-Control, X-Requested-With");
	    httpResponse.setHeader("Access-Control-Allow-Credentials", "include");
		 System.out.println("request URL : " + requestURI);
		 System.out.println("heder: " + httpRequest.getHeader(AUTH_HEADER));
		 if(isExcluded(requestURI)) {
			 System.out.println("continue");
			 chain.doFilter(httpRequest, httpResponse);
		 } else {
			 final String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
			 if(authHeader == null || !authHeader.startsWith("Bearer ")){
	             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "An exception occurred");
	         }  
		     final String token = authHeader.substring(7);
		     System.out.println("token: " + token);
		     Claims claims = (Claims) Jwts.parserBuilder().setSigningKey(JwtTokenUtil.SECRET_KEY).build().parse(token).getBody();
		     httpRequest.setAttribute("claims", claims);
		     chain.doFilter(httpRequest, httpResponse);
		 }
	}
	
	private boolean isExcluded(String requestURI) {
		AntPathMatcher matcher = new AntPathMatcher();
		return matcher.match(EXCLUDE, requestURI);
	}
}
