import React from "react";
import History from "./History";
import { doLogout } from "../../auth";
import CustomNavbar from "../Header";

const HistoryMain = () => {
  return (
    <div>
      <CustomNavbar isProfile />
      <History />
    </div>
  );
};

export default HistoryMain;
