import React from "react";
import "./PaymentMethodOptions.css";

const PaymentMethodOptions = ({ paymentMethods, onSelect }) => {
  return (
    <select
      className="payment-dropdown"
      onChange={(e) => onSelect(parseInt(e.target.value))}
    >
      <option value="" hidden>
        Select a payment method
      </option>
      {paymentMethods.map((method) => (
        <option key={method.id} value={method.id}>
          {method.name}
        </option>
      ))}
    </select>
  );
};

export default PaymentMethodOptions;
