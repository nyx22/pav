import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./OrderMain.css";
import PaymentMethodOptions from "./PaymentMethodOptions";
import OrderActions from "./OrderActions";
import CustomNavbar from "../Header/index.jsx";
import { calculateOrderAmount, isBalanceSufficient } from "./utils";
import getAllItemsInCart from "../../services/Cart/getAllCartItems";
import Item from "./item";
import placeOrder from "../../services/Order/placeOrder";
import { toast } from "react-toastify";
import { addTokenToHeaders } from "../../services/utils/jwtTokenHelper";
import { doLogout } from "../../auth/index.js";
import Loading from "../Loading/loading";
const paymentMethods = [{ id: 1, name: "Wallet" } ];

const OrderMain = () => {
  const userId = useParams().userId;
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState(null);

  const [totalItem, setTotalItems] = useState(0);

  const getItems = async () => {
    try {
      const res = await getAllItemsInCart(userId);
      if (res.data?.success) {
        setCartItems(res.data);
        console.log("res data from Ordermain: ", res.data?.cartItems);
        setTotalItems(
          res.data?.cartItems.reduce((acc, item) => acc + item?.qty, 0)
        );
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [walletBalance, setWalletBalance] = useState();

  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderFailed, setOrderFailed] = useState(false);

  useEffect(() => {
    addTokenToHeaders();
  }, []);

  useEffect(() => {
    getItems();
  }, [walletBalance, totalItem, orderSuccess]);

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(parseInt(methodId));
  };

  //place order====================================================
  const [order, setOrder] = useState(null);

  const price = cartItems?.cartItems.reduce(
    (acc, item) => acc + item?.qty * item?.item[0]?.price,
    0
  );

  console.log("price is ", price);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (cartItems === null) {
    return <h1>No Items In the Cart</h1>;
  }

  return (
    <div>
      <CustomNavbar isProfile />
      <center>
        <h1
          style={{
            color: "orange",
            fontSize: "40px",
            fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
            marginTop:"70px",
          }}
        >
          <b>Order Page</b>
        </h1>

        <a href="/user/checkout/:userId/orderHistory">
          {price === 0 && (
      <button
        className="view-order-status-button"
        onClick={() => {
        
        }}
      >
        View Order Status
      </button>
    )}
    </a>
       
          <div
            style={{
              backgroundColor: "#f5f5ed",
              padding: "10px",
              width: "fit-content",
              color: "black",
              fontSize: "20px",
              borderRadius: "5px",
              fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
            }}
          >
            Please go ahead and place your order.
          </div>
       
        <div className="cart-items">
          <div className="cart-items-container">
            {/* Display headers only once */}
            <div className="item-row header-row">
              <div className="column-header" /*style={{background:"#343a40"}}*/>
                <b>Item Name</b>
              </div>
              <div className="column-header" /*style={{background:"#343a40"}}*/>
                <b>Quantity</b>
              </div>
              <div className="column-header" /*style={{background:"#343a40"}}*/>
                <b>Price</b>
              </div>
            </div>
            {cartItems.cartItems.map((item) => (
              <Item {...item} />
            ))}
          </div>
          </div>
          <div
            style={{
              display:"flex",
              
              fontSize: "20px",
              fontWeight: "bold",
              marginTop: "20px",
              fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
            }}
          >
            
            <div className="left-summary"> <span className="total-cart-items-hover"> Total Cart Items : {totalItem}</span> </div>
              
                <div className="right-summary"><span className="total-cart-items-hover">   Payable Amount :  ₹ {price}</span>
             
               
               
           </div>   
          {/* <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
            }}
          >
           <div> Payable Amount :<span> Rs.{price}</span></div>
          </h3> */}
             {/* <a href="/user/checkout/:userId/orderHistory">
          {price === 0 && (
      <button
        className="view-order-status-button"
        onClick={() => {
          // Handle the click event for the "View Order Status" button
          // You can add your logic here to view the order status
        }}
      >
        View Order Status
      </button>
    )}
    </a> */}
        </div>

        <PaymentMethodOptions
          paymentMethods={paymentMethods}
          onSelect={handlePaymentMethodSelect}
         
        />
        <OrderActions
          selectedPaymentMethod={selectedPaymentMethod}
          walletBalance={walletBalance}
          orderSuccessUpdate={setOrderSuccess}
          // onPlaceOrder={handlePlaceOrder}
          price={price}
        />
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <p>{modalMessage}</p>
            </div>
          </div>
        )}
      </center>
    </div>
  );
};

export default OrderMain;
