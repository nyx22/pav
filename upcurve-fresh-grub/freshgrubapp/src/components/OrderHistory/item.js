import React, { useEffect, useState } from "react";

const Item = ({ _id, userId, item, qty, date, time }) => {
  const { id, stallId, menuItemName, price, menuItemImage } = item[0];

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
            <p class="dot"></p>
            <span>Ordered</span>
          </div>
        </div>
      </div>
      {/* <hr /> */}
    </>
  );
};
export default Item;
