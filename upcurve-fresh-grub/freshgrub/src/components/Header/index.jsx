import React from "react";
import { Link, NavLink as ReactLink } from "react-router-dom";
import logo from "../../pages/logo5.jpg";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge } from "@mui/material";
import Profile from "../Profile/profile";

import { Nav, Button, NavItem, Navbar, NavbarBrand } from "reactstrap";
import jwtDecode from "jwt-decode";
import { ProductionQuantityLimits } from "@mui/icons-material";
import LogoPart from "./LogoPart";

const navbarStyles = {
  position: "fixed",
  top: 0,
  width: "100%",
  zIndex: 100,
};
const CustomNavbar = ({
  buttonText,
  secondButtonText,
  onAddCallback,
  badgeNumber,
  onLogoutCallback,
  isProfile,
}) => {
  let userId;
  const localStorageData = sessionStorage.getItem("data");

  if (localStorageData) {
    const token = JSON.parse(localStorageData).token;
    const decodedValue = jwtDecode(token);
    console.log("decodedValue: ", decodedValue);
    userId = decodedValue.id;
  } else {
    console.error("localStorageData is null or undefined");
  }

  return (
    <div>
      <Navbar color="dark" expand="md" style={navbarStyles}>
        <LogoPart />
        <Nav className="ms-auto">
          {buttonText !== undefined && (
            <NavItem className="my-auto">
              {buttonText === "Go to cart" ? (
                <div style={{ padding: "10px", marginRight: "20px" }}>
                  <Badge badgeContent={badgeNumber} color="primary">
                    <ShoppingCartIcon
                      sx={{ fontSize: 28, color: "white" }}
                      onClick={() => {
                        console.log("coming here: ");
                        onAddCallback();
                      }}
                    />
                  </Badge>
                </div>
              ) : (
                <Button
                  color="primary"
                  onClick={() => {
                    console.log("coming here: ");
                    onAddCallback();
                  }}
                >
                  {buttonText}
                </Button>
              )}
            </NavItem>
          )}
          {isProfile && <Profile />}
        </Nav>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
