import React from "react";
import { NavLink as ReactLink } from "react-router-dom";
import logo from "../../pages/logo5.jpg";
import { Nav, Button, NavItem, Navbar, NavbarBrand } from "reactstrap";
import jwtDecode from "jwt-decode";

const LogoPart = () => {
  let userId;
  let role;
  const localStorageData = sessionStorage.getItem("data");

  if (localStorageData) {
    const token = JSON.parse(localStorageData).token;
    const decodedValue = jwtDecode(token);
    console.log("decodedValue: ", decodedValue);
    userId = decodedValue.id;
    role = decodedValue.role;
  } else {
    console.error("localStorageData is null or undefined");
  }
  if (role === "user") {
    return (
      <NavbarBrand
        tag={ReactLink}
        to="/user"
        style={{
          color: "white",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          transition: "color 0.3s",
          fontSize: "24px",
          fontFamily:
            '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
        }}
        onMouseEnter={(e) => (e.target.style.color = "orange")}
        onMouseLeave={(e) => (e.target.style.color = "white")}
      >
        <img src={logo} width="45" height="45" alt="" />
        FreshGrub
      </NavbarBrand>
    );
  } else if (role === "vendor") {
    return (
      <NavbarBrand
        tag={ReactLink}
        to="/vendor"
        style={{
          color: "white",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          transition: "color 0.3s",
          fontSize: "24px",
          fontFamily:
            '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
        }}
        onMouseEnter={(e) => (e.target.style.color = "orange")}
        onMouseLeave={(e) => (e.target.style.color = "white")}
      >
        <img src={logo} width="45" height="45" alt="" />
        FreshGrub
      </NavbarBrand>
    );
  } else {
    return (
      <NavbarBrand
        tag={ReactLink}
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          transition: "color 0.3s",
          fontSize: "24px",
          fontFamily:
            '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
        }}
        onMouseEnter={(e) => (e.target.style.color = "orange")}
        onMouseLeave={(e) => (e.target.style.color = "white")}
      >
        <img src={logo} width="45" height="45" alt="" />
        FreshGrub
      </NavbarBrand>
    );
  }
};
export default LogoPart;
