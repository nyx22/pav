import React, { useEffect, useState } from "react";
import "./OrderActions.css";
import { calculateOrderAmount } from "./utils";
import { useParams } from "react-router-dom";
import getWalletAmount from "../../services/Order/getWalletAmount";
import placeOrder from "../../services/Order/placeOrder";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const OrderActions = ({
  selectedPaymentMethod,
  walletBalance,
  orderSuccessUpdate,
  price,
}) => {
  const userId = useParams().userId;
  const navigate = useNavigate();

  const [walletAmount, setWalletAmount] = useState(null);
  //const [orderDateTime, setOrderDateTime] = useState(null); // State to store date and time

  const getWallet = async () => {
    const res = await getWalletAmount(userId);
    if (res.data?.success) {
      setWalletAmount(res.data);
    }
  };

  const handlePlaceOrder = async () => {
    if (price <= 0) {
      // Display a "Please add items to order" pop-up if totalItems is 0 or less
      toast.error(
        "You don't have items to place order...The menu is full of tasty options. Please go ahead and add some items to your order.",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000, // Automatically close after 3 seconds
          className: "custom-toast ",
        }
      );
      return; // Exit the function early
    }

    try {
      const res = await placeOrder(userId, price);

      if (res.data?.success && !(walletAmount.walletAmount < price)) {
        setWalletAmount(res.data);
        orderSuccessUpdate(true);
        const currentDateTime = new Date();

        // Display a success notification
        toast.success("Order placed successfully!", {
          //position: toast.POSITION.TOP_CENTER,
          autoClose: 2000, 
          //className: "custom-toast custom-toast-success ",
        });

        navigate("/user/checkout/:userId/orderHistory")
      } else {
        // Display an error notification if the order fails
        toast.error("Sorry! Insufficient Balance to place your order", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000, // Automatically close after 3 seconds
          className: "custom-toast custom-toast-error ",
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 404 &&
        walletAmount.walletAmount < price
      ) {
        // Handle the 404 error by displaying a custom error notification
        toast.error("Sorry! Insufficient Balance to place your order", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000, // Automatically close after 3 seconds
          className: "custom-toast custom-toast-error ",
        });
      } else {
        // Handle other errors here if needed
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  const orderAmount = calculateOrderAmount();

  return (
    <div className="order-actions">
      <button
        className="place-order-btn"
        onClick={handlePlaceOrder}
        disabled={
          !selectedPaymentMethod /* || walletAmount.walletAmount < price || price === 0*/
        }
      >
        Place Order
      </button>
      {selectedPaymentMethod === 1 && (
        <p className="wallet-balance-message">
          <span className="wallet-label">Your wallet balance:</span>{" "}
          <span
            className="wallet-balance"
            style={{ fontSize: "20px", fontFamily: "Times New Roman" }}
          >
            {walletAmount.walletAmount}/-
          </span>
        </p>
      )}
      <br></br>
      {/* Display the stored date and time */}
      {/*orderDateTime && (
        <p className="order-datetime">
      Order placed on: {orderDateTime.toLocaleString()}
        </p>
      )*/}
    </div>
  );
};

export default OrderActions;
