import CustomNavbar from "../../components/Header";
import { useState, useEffect } from "react";
import getAllItemsInCart from "../../services/Cart/getAllCartItems";
import { getAllCategories } from "../../services/Categories/getAllCategories";
import MenuPack from "../../components/CategoriesList";
import { addTokenToHeaders } from "../../services/utils/jwtTokenHelper";
import { validateTokenAndRedirect } from "../../services/utils/jwtTokenHelper";
import { useNavigate } from "react-router-dom";
import { doLogout } from "../../auth";
import jwtDecode from "jwt-decode";
import Profile from "../../components/Profile/profile";

const UserHome = () => {
  const navigate = useNavigate();
  const [errorCode, setErrorCode] = useState(0);
  const [categories, setCategories] = useState([]); //to store an array of category objects
  const [badgeNumber, setBadgeNumber] = useState(0);

  //to get the userId
  const localStorageData = sessionStorage.getItem("data");
  const token = JSON.parse(localStorageData).token;
  const decodedValue = jwtDecode(token);
  console.log("decodedValue: ", decodedValue);
  const userId = decodedValue.id;

  const getItems = async () => {
    const res = await getAllItemsInCart(userId);
    if (res.data?.success) {
      console.log("res data: ", res.data?.cartItems);
      setBadgeNumber(
        res.data?.cartItems.reduce((acc, item) => acc + item?.qty, 0)
      );
    }
  };

  const getAllCategoriesWrapper = async () => {
    //makes an API call to getAllCategories and updates the categories state with the data.
    const response = await getAllCategories();
    setCategories(
      response?.data?.foodStalls.map((foodStall) => {
        return {
          id: foodStall.id,
          name: foodStall.stallName,
          image: foodStall.stallImage,
        };
      })
    );
  };

  useEffect(() => {
    validateTokenAndRedirect();
    addTokenToHeaders();
    getAllCategoriesWrapper();
    getItems();
  }, []);

  return (
    <div>
      <CustomNavbar
        isFoodItem
        buttonText={"Go to cart"}
        onAddCallback={() => {
          console.log("Clicked go to cart btn");
          navigate(`/user/cart/${userId}`);
        }}
        // onLogoutCallback={doLogout}
        badgeNumber={badgeNumber}
        isProfile
      />
      <MenuPack title="categories" items={categories} />
    </div>
  );
};
export default UserHome;
