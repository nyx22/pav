import React, { useEffect, useState } from "react";
import axios from "axios";
import StatusTracker from "./StatusTracker"; // Import your custom Status Tracker component
import "./StatusTracker.css"; // Import the CSS file for the Status Tracker


const Item = ({ _id, userId, item, qty, orderStatus, date, time}) => {
  console.log('item: ',item, 'order: ', orderStatus);
  const { id, stallId, menuItemName, price, menuItemImage} = item[0];
  
  

  return (
    <>
      <div class="item">
        <div class="items">
          <div class="image">
            <img
              style={{ height: "6rem" }}
              src={`data:image/jpeg;base64,${menuItemImage}`}
              alt="{menuItemName}"
            />
          </div>
          <div class="info">
            <h3 className="itemName">{menuItemName}</h3>
            <small>Quantity : {qty}</small>
          </div>
          <div class="price">&#8377; {price * qty}</div>
          <div class="deliver">
          <div className="deliver">
        <StatusTracker orderStatus={orderStatus} />
        </div>
          </div>
          
        </div>
      </div>
      {/* <hr /> */}
    </>
  );
};
export default Item;
