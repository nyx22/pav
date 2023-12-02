package com.example.demo.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import com.example.demo.responses.VendorOrderResponse;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Cart;
import com.example.demo.entities.CartProduct;
import com.example.demo.entities.Menu;
import com.example.demo.entities.User;
import com.example.demo.repositories.CartRepo;
import com.example.demo.repositories.MenuRepository;
import com.example.demo.repositories.UserRepo;
import com.example.demo.responses.OrderResponse;

import jakarta.mail.MessagingException;
import org.thymeleaf.context.Context;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.aggregation.*;




@EnableScheduling
@Service
public class OrderService {
	 private final MongoTemplate mongoTemplate;
    private final UserRepo userRepository;
    private final MenuRepository menuRepository;
    private final CartRepo cartRepository;
    private final EmailService emailService;

	
  


    public OrderService(MongoTemplate mongoTemplate, UserRepo userRepository, MenuRepository menuRepository, CartRepo cartRepository, EmailService emailService) {
    	this.mongoTemplate = mongoTemplate;
        this.userRepository = userRepository;
        this.menuRepository = menuRepository;
        this.cartRepository = cartRepository;
        this.emailService = emailService;

    }

    public ResponseEntity<OrderResponse> getWalletAmount(String userId) {
        Optional<User> user = userRepository.findById(userId);
        OrderResponse orderResponse = new OrderResponse();
        if (user.isEmpty()) {
            orderResponse.setMessage("No user found");
            orderResponse.setSuccess(false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(orderResponse);
        }
        if(user.get().getRole().equals("user")) {
            orderResponse.setWalletAmount(user.get().getWallet());
            orderResponse.setMessage("Wallet Amount fetched successfully");
            orderResponse.setSuccess(true);
            return ResponseEntity.status(HttpStatus.OK).body(orderResponse);
        }
        else{
            // for vendor wallet earnings of the day

            LocalDate date =LocalDate.now();

           // Optional<List<Cart>> todaysOrder= cartRepository.findByDateAndIsOrderedTrue(date);
            Optional<List<Cart>> todaysOrder= cartRepository.findByDate(date);
            if(todaysOrder.isEmpty())
                orderResponse.setWalletAmount(0);
            else {
                int totalEarnings = 0;
                for (Cart cartItem : todaysOrder.get())
                {
                	 if(cartItem.getIsOrdered()) {
                         String itemId = cartItem.getItemId();
                         int quantity = cartItem.getQty();

                    int itemPrice = getItemPriceById(itemId);
                    int itemEarnings = itemPrice * quantity;

                    totalEarnings += itemEarnings;
                }
                }
                orderResponse.setWalletAmount(totalEarnings);
            }
            orderResponse.setMessage("Wallet Amount fetched successfully");
            orderResponse.setSuccess(true);
            return ResponseEntity.status(HttpStatus.OK).body(orderResponse);
        }
    }

    public int getItemPriceById(String itemId) {
        Optional<Menu> menu = menuRepository.findById(itemId);
        if (menu.isPresent()) {
            return menu.get().getPrice();
        } else {

            return 0;
        }
    }

//    @Scheduled(cron = "0 0 0 * * *") // Run every day at midnight
//    public void updateWallets() {
//        List<User> users = userRepository.findAll();
//        users.forEach(user -> {
//            user.setWallet(150);
//            // Set default money
//            userRepository.save(user);
//        });
//    }
    
    @Scheduled(fixedDelay = 10000000)
    public void scheduleFixedDelayTask() {
        System.out.println("hello from scheduler");
        List<User> users = userRepository.findAll();
        users.forEach(user -> {
            user.setWallet(150);
            // Set default money
            userRepository.save(user);
        });
    }

    public ResponseEntity<OrderResponse> placeOrder(String userId, int orderAmount) {

        OrderResponse orderResponse = new OrderResponse();

        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            orderResponse.setMessage("No user found");
            orderResponse.setSuccess(false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(orderResponse);
        }

        User user = optionalUser.get();
        if (user.getWallet() < orderAmount) {

            orderResponse.setMessage("Insufficient balance");
            orderResponse.setSuccess(false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(orderResponse);

        }

        user.setWallet(user.getWallet() - orderAmount);
        userRepository.save(user); // Save the changes to the user's wallet

        Optional<List<Cart>> optionalUserCartItems = cartRepository.findByUserIdAndIsOrderedFalse(userId);
        List<Cart> userCartItems = optionalUserCartItems.get();
        

        LocalDate localDate = LocalDate.now();
        LocalTime localTime = LocalTime.now();
        System.out.println(localDate);
        
        userCartItems.forEach(cartItem -> {
            System.out.println(cartItem);
            cartItem.setIsOrdered(true);
            cartItem.setTime(localTime);
            cartItem.setDate(localDate);
        });
        cartRepository.saveAll(userCartItems);
        orderResponse.setWalletAmount(user.getWallet());


        orderResponse.setMessage("Successfully ordered");
        orderResponse.setSuccess(true);
        return ResponseEntity.status(HttpStatus.OK).body(orderResponse);
    }
    
    public ResponseEntity<OrderResponse> getOrderHistory(String userId) {
        OrderResponse orderResponse = new OrderResponse();

        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            orderResponse.setMessage("No user found");
            orderResponse.setSuccess(false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(orderResponse);
        }

        LookupOperation lookup = LookupOperation.newLookup()
                .from("menu_items")
                .localField("itemId")
                .foreignField("_id")
                .as("item");

        Aggregation aggregation =  Aggregation.newAggregation(Aggregation.match(Criteria.where("userId").is(userId).andOperator(Criteria.where("isOrdered").is(true))), lookup );

        List<CartProduct> cartItems = mongoTemplate.aggregate(aggregation, "cart", CartProduct.class).getMappedResults();

        orderResponse.setCartItems(cartItems);
        orderResponse.setMessage("Successfully fetched");
        orderResponse.setSuccess(true);
        return ResponseEntity.status(HttpStatus.OK).body(orderResponse);

    }

    //=======================================Vendor methods====================================================

    public ResponseEntity<VendorOrderResponse> getOrders(String userId, int pageNumber, int pageSize, String type) {

        VendorOrderResponse orderResponse = new VendorOrderResponse();

        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            orderResponse.setMessage("No user found");
            orderResponse.setSuccess(false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(orderResponse);
        }
        else {
            User vendor=optionalUser.get();
            if(vendor.getRole().equalsIgnoreCase("vendor"))
            {

                //For pages we  have to use 0-based page numbers
                Pageable pageable = PageRequest.of(pageNumber-1, pageSize, Sort.by(Sort.Order.desc("date"), Sort.Order.desc("time")));

                LookupOperation lookupOperation = LookupOperation.newLookup()
                        .from("menu_items")
                        .localField("itemId")
                        .foreignField("_id")
                        .as("item");

                long totalItemCount;
                MatchOperation matchOperation;
                if(type.equalsIgnoreCase("Active")) {
                     matchOperation = Aggregation.match(
                            Criteria.where("isOrdered").is(true)
                                    .and("orderStatus").ne("Order Delivered")
                    );
                    totalItemCount = cartRepository.countItemsOrderedAndNotTaken();
                }
                else {
                    matchOperation = Aggregation.match(
                            Criteria.where("isOrdered").is(true)
                                    .and("orderStatus").is("Order Delivered")
                    );
                    totalItemCount = cartRepository.countByIsOrderedAndOrderStatus(true, "Order Delivered");
                }

                Aggregation aggregation = Aggregation.newAggregation(

                        lookupOperation,
                        matchOperation,
                        Aggregation.sort(pageable.getSort()),
                        Aggregation.skip((long) (pageNumber-1) * pageSize),
                        Aggregation.limit(pageSize)
                );

                // Execute the aggregation query
                AggregationResults<CartProduct> aggregationResults = mongoTemplate.aggregate(aggregation, "cart", CartProduct.class);

                // Get the aggregated CartProduct items
                List<CartProduct> cartItems = aggregationResults.getMappedResults();

                orderResponse.setCartItems(cartItems);
                orderResponse.setPageNumber(pageNumber);
                orderResponse.setCurrPageSize(cartItems.size());



                orderResponse.setTotalElements(totalItemCount);

                int totalPages = (int) Math.ceil((double) totalItemCount / pageSize);
                orderResponse.setTotalPages(totalPages);

                orderResponse.setLastPage(pageNumber >= totalPages);
                orderResponse.setMessage("Successfully fetched items");
                orderResponse.setSuccess(true);
                orderResponse.setMessage("Successfully fetched items");
                orderResponse.setSuccess(true);
                return ResponseEntity.status(HttpStatus.OK).body(orderResponse);

            }
        }
        orderResponse.setMessage("Unathorized access");
        orderResponse.setSuccess(false);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(orderResponse);
    }
    
    public ResponseEntity<OrderResponse> updateOrderStatus(String userId, String orderId, String newStatus) throws MessagingException {
        OrderResponse orderResponse = new OrderResponse();

        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            orderResponse.setMessage("No user found");
            orderResponse.setSuccess(false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(orderResponse);
        }
        else{
            User vendor=optionalUser.get();
            if(vendor.getRole().equalsIgnoreCase("vendor"))
            {
                Optional<Cart> cartItemsOptional = cartRepository.findBy_idAndIsOrderedTrue(orderId);

                if (cartItemsOptional.isPresent())
                {
                    Cart userCartItems = cartItemsOptional.get();
                    userCartItems.setOrderStatus(newStatus);
                    String itemId = userCartItems.getItemId();
                    String itemName = menuRepository.findById(itemId).get().getMenuItemName();
                    cartRepository.save(userCartItems);
                    if(newStatus.equalsIgnoreCase("Ready"))
                    {
                        String emailUserId = userCartItems.getUserId();
                        Optional<User> emailUser= userRepository.findById(emailUserId);
                        String email = emailUser.get().getEmail();
                        //emailService.sendEmail(email,"Order Ready", "No more wait! Your order is ready to be picked up. Thank you for ordering from us. Have a good day!");
                        Context context = new Context();
                        context.setVariable("message","No more wait! Your order for "+itemName+" is ready to be picked up. Thank you for ordering from us. Have a good day!");
                        emailService.sendEmailWithHtmlTemplate(email,"Order Ready", "email-template", context);
                        
                        
                        orderResponse.setMessage("Order Status updated succesfully");
                        orderResponse.setSuccess(true);
                        return ResponseEntity.status(HttpStatus.OK).body(orderResponse);
                    
                    }
                    
                    orderResponse.setMessage("Order Status updated succesfully");
                    orderResponse.setSuccess(true);
                    return ResponseEntity.status(HttpStatus.OK).body(orderResponse);
                }
                else {
                    orderResponse.setMessage("No item found");
                    orderResponse.setSuccess(false);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(orderResponse);
                }
            }
        }
        orderResponse.setMessage("Unathorized access");
        orderResponse.setSuccess(false);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(orderResponse);
    }

    /*
    public ResponseEntity<OrderResponse> getOrders(String userId) {

        OrderResponse orderResponse = new OrderResponse();

        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            orderResponse.setMessage("No user found");
            orderResponse.setSuccess(false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(orderResponse);
        }
        else {
            User vendor=optionalUser.get();
            if(vendor.getRole().equalsIgnoreCase("vendor"))
            {
                LookupOperation lookup = LookupOperation.newLookup()
                        .from("menu_items")
                        .localField("itemId")
                        .foreignField("_id")
                        .as("item");

//                Aggregation aggregation =  Aggregation.newAggregation(Aggregation.match(Criteria.where("isOrdered").is(true)), lookup );

                Aggregation aggregation = Aggregation.newAggregation(
                        Aggregation.match(Criteria.where("isOrdered").is(true)),
                        Aggregation.sort(Sort.Direction.DESC, "_id"),
                        lookup
                );
                List<CartProduct> cartItems = mongoTemplate.aggregate(aggregation, "cart", CartProduct.class).getMappedResults();

                orderResponse.setCartItems(cartItems);
                orderResponse.setMessage("Successfully fetched ");
                orderResponse.setSuccess(true);
                return ResponseEntity.status(HttpStatus.OK).body(orderResponse);
            }
        }
        orderResponse.setMessage("Unathorized access");
        orderResponse.setSuccess(false);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(orderResponse);

    }
    */
    
}