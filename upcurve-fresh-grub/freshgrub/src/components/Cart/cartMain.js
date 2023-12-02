import React from "react";
import CustomNavbar from "../Header/index.jsx";
import Cart from "./cart.js";

const cartMain = () => {
  return (
    <div>
      <CustomNavbar isProfile />
      <Cart />
    </div>
  );
};

export default cartMain;
