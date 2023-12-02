import React from "react";
import CustomNavbar from "../Header/index.jsx";
import Cart from "./cart.js";
import { doLogout } from "../../auth/index.js";

const cartMain = () => {
  return (
    <div>
      {/* <CustomNavbar onLogoutCallback={doLogout} /> */}
      <CustomNavbar isProfile />
      <Cart />
    </div>
  );
};

export default cartMain;
