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

const paymentMethods = [{ id: 1, name: "Wallet" }];

const OrderMain = () => {
  const userId = useParams().userId;

  const [cartItems, setCartItems] = useState(null);

  const [totalItem, setTotalItems] = useState(0);

  const getItems = async () => {
    const res = await getAllItemsInCart(userId);
    if (res.data?.success) {
      setCartItems(res.data);
      console.log("res data from Ordermain: ", res.data?.cartItems);
      setTotalItems(
        res.data?.cartItems.reduce((acc, item) => acc + item?.qty, 0)
      );
    }
  };

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [walletBalance, setWalletBalance] = useState();

  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handlePlaceOrder = async () => {
    //   const res = await placeOrder(userId, price);
    //   if (res.data?.success) {
    //     setOrder(res.data);
    //     console.log("Place Order data: ", res.data);
    //   }
  };

  // useEffect(() => {
  // getWallet();
  // }, [order]);

  //end place order ===============================================

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (cartItems === null) {
    return <h1>No Items In the Cart</h1>;
  }

  return (
    <div>
      <CustomNavbar isProfile />
      <center>
        <h1>
          <b>Order Page</b>
        </h1>
        {orderSuccess && (
          <div
            style={{
              backgroundColor: "green",
              padding: "10px",
              width: "fit-content",
              color: "white",
              fontSize: "20px",
              borderRadius: "5px",
            }}
          >
            Order Placed Successfully
          </div>
        )}
        <div className="cart-items">
          <div className="cart-items-container">
            {cartItems.cartItems.map((item) => (
              <Item {...item} />
            ))}
          </div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            Total Cart Items: {totalItem}
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
            Payable Amount :<span>{price}</span>
          </h3>
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
