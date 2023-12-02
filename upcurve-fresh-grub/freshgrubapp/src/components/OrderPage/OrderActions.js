import React, { useEffect, useState } from "react";
import "./OrderActions.css";
import { calculateOrderAmount } from "./utils";
import { useParams } from "react-router-dom";
import getWalletAmount from "../../services/Order/getWalletAmount";
import placeOrder from "../../services/Order/placeOrder";
const OrderActions = ({
  selectedPaymentMethod,
  walletBalance,
  orderSuccessUpdate,
  price,
}) => {
  const userId = useParams().userId;

  const [walletAmount, setWalletAmount] = useState(null);

  // const [totalItem, setTotalItems] = useState(0);

  const getWallet = async () => {
    const res = await getWalletAmount(userId);
    if (res.data?.success) {
      setWalletAmount(res.data);
      console.log("res data from OrderAction: ", res.data);
    }
  };

  const [order, setOrder] = useState(null);
  const handlePlaceOrder = async () => {
    const res = await placeOrder(userId, price);
    if (res.data?.success) {
      setOrder(res.data);
      orderSuccessUpdate(true);

      console.log("Place Order data: ", res.data);
    }
  };

  // if (order.success) toast("Successfully ordrered");

  useEffect(() => {
    getWallet();
  }, [order]);

  // const handlePlaceOrder = () => {
  // onPlaceOrder();
  // };

  // useEffect(() => {
  // getWallet();
  // }, [order]);
  const orderAmount = calculateOrderAmount(); // Calculate the order amount

  return (
    <div className="order-actions">
      <button
        className="place-order-btn"
        onClick={handlePlaceOrder}
        disabled={!selectedPaymentMethod || walletAmount.walletAmount < price}
      >
        Place Order
      </button>

      {selectedPaymentMethod === 1 && (
        <p className="wallet-balance-message">
          <span className="wallet-label">Your wallet balance:</span>{" "}
          <span className="wallet-balance" style={{ fontSize: "20px" }}>
            {walletAmount.walletAmount}/-
          </span>
        </p>
      )}
    </div>
  );
};

export default OrderActions;
