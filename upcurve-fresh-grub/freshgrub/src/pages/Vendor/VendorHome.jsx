import { Fragment, useState, useEffect } from "react";
import MenuPack from "../../components/CategoriesList/index.jsx";
import {
  Box,
  Typography,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import { createCategory } from "../../services/Categories/createCategory.js";
import { getAllCategories } from "../../services/Categories/getAllCategories.js";
import { deleteCategories } from "../../services/Categories/deleteCategory.js";
import { validateTokenAndRedirectForVendor } from "../../services/utils/jwtTokenHelper.js";
import CustomNavbar from "../../components/Header/index.jsx";
import { doLogout } from "../../auth/index";

const VendorHome = () => {
  useEffect(() => {
    validateTokenAndRedirectForVendor();
  }, []);

  return (
    <div>
      <CustomNavbar isProfile />
      <MenuPack title={"categories"} />
    </div>
  );
};
export default VendorHome;
