import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Redirect,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/index.jsx";
import Signup from "./components/Signup/index.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/index.jsx";
import UserHome from "./pages/User/UserHome.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VendorHome from "./pages/Vendor/VendorHome.jsx";
import VendorFoodItemsPage from "./pages/Vendor/VendorFoodItemsPage.jsx";
import UserFoodItemsPage from "./pages/User/UserFoodItemsPage.jsx";
import CartPage from "./components/Cart/cartMain.js";
import OrderMain from "./components/OrderPage/OrderMain.js";
import HistoryMain from "./components/OrderHistory/HistoryMain.js";
import OrderStatus from "./components/OrderStatus/StatusMain.js";
//import { isLoggedIn} from "./auth/index.js";
import { NoLogoutBack } from "./auth/index.js";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route
          path="/user"
          element={
            <NoLogoutBack>
              <UserHome />
            </NoLogoutBack>
          }
        />
        <Route
          path="/user/:categoryId"
          element={
            <NoLogoutBack>
              <UserFoodItemsPage />
            </NoLogoutBack>
          }
        />
        <Route
          path="/user/cart/:userId"
          element={
            <NoLogoutBack>
              <CartPage />
            </NoLogoutBack>
          }
        />
        <Route
          path="/user/checkout/:userId"
          element={
            <NoLogoutBack>
              <OrderMain />
            </NoLogoutBack>
          }
        />
        <Route
          path="/user/checkout/:userId/orderHistory"
          element={<HistoryMain />}
        />
        <Route
          path="/unauthorized"
          element={<div>Not enough permissions</div>}
        ></Route>

        <Route
          path="/vendor"
          element={
            <NoLogoutBack>
              <VendorHome />
            </NoLogoutBack>
          }
        ></Route>
        <Route
          path="vendor/:categoryId"
          element={
            <NoLogoutBack>
              <VendorFoodItemsPage />
            </NoLogoutBack>
          }
        />

        <Route
          path="/vendor/OrderStatus"
          element={
            <NoLogoutBack>
              <OrderStatus />
            </NoLogoutBack>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
