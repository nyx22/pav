import React, { useEffect, useState } from "react";
import "./item.css";
// import incrementItem from "../../services/Cart/incrItem"
import addToCart from "../../services/Cart/addToCart";
import decrement from "../../services/Cart/decrementItem";
import remove from "../../services/Cart/deleteItem";
import { toast } from "react-toastify";

const Item = ({ _id, userId, item, qty }) => {
  const { id, stallId, menuItemName, price, menuItemImage } = item[0];
  return (
    <div class="center-grid-container" /*style={{background:"#343a40"}}*/>
      <div
        className="items-information" /*style={{background:"#343a40",color:"white"}}*/
      >
        <h2>{menuItemName}</h2>
        <h2>{qty}</h2>
        <h3> ₹ {price * qty}</h3>
      </div>
      <hr />
    </div>
  );
};
export default Item;
