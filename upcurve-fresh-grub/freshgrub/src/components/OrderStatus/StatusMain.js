import React from "react";
import Status from "./Status.js";
import CustomNavbar from "../Header";
import "./Status.css";

const StatusMain = () => {
  return (
    <div>
      <CustomNavbar isProfile />
      <Status />
      {/* Hello */}
    </div>
  );
};

export default StatusMain;
