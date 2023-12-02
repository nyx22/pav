import CustomNavbar from "../../components/Header";
import { useState, useEffect } from "react";
import { getAllFoodItems } from "../../services/Foods/getAllFoodItems";
import MenuPack from "../../components/CategoriesList";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import FoodCard from "../../components/UserFoodCard";
import jwtDecode from "jwt-decode";
import addToCart from "../../services/Cart/addToCart";
import SubNavbar from "../../components/SubNavbar";
import getAllItemsInCart from "../../services/Cart/getAllCartItems";
import { addTokenToHeaders } from "../../services/utils/jwtTokenHelper";
import { validateTokenAndRedirect } from "../../services/utils/jwtTokenHelper";
import { doLogout } from "../../auth";
import { Grid } from "@mui/material";
const UserFoodItemsPage = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [subNavbarTitle, setSubNavbarTitle] = useState(location?.state?.name);

  const localStorageData = sessionStorage.getItem("data");
  const token = JSON.parse(localStorageData).token;
  const decodedValue = jwtDecode(token);
  console.log("decodedValue: ", decodedValue);
  const userId = decodedValue.id;
  console.log("userId: ", userId);

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const [toastText, setToastText] = useState("");

  const [foodItems, setFoodItems] = useState([]);

  const [badgeNumber, setBadgeNumber] = useState(0);

  const getItems = async () => {
    const res = await getAllItemsInCart(userId);
    if (res.data?.success) {
      console.log("res data: ", res.data?.cartItems);
      setBadgeNumber(
        res.data?.cartItems.reduce((acc, item) => acc + item?.qty, 0)
      );
    }
  };

  const getAllfoodItemsWrapper = async () => {
    try {
      const response = await getAllFoodItems(params.categoryId);
      console.log("response: ", response?.data?.menuItems);
      if (response !== null) {
        setFoodItems(
          response?.data?.menuItems?.map((foodStall) => {
            return {
              id: foodStall.id,
              name: foodStall.menuItemName,
              price: foodStall.price,
              image: foodStall.menuItemImage,
            };
          })
        );
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  useEffect(() => {
    validateTokenAndRedirect();
    addTokenToHeaders();
    getAllfoodItemsWrapper();
    getItems();
  }, []);

  const cartClickHandler = async (id) => {
    const response = await addToCart(userId, {
      itemId: id,
      qty: 1,
      isOrdered: false,
    });
    if (response.status) {
      setStatus("success");
      setToastText("Added To Cart");
      setOpen(true);
      getItems();
    } else {
      setStatus("error");
      setToastText("Failed to add to Cart");
      setOpen(true);
    }
  };

  return (
    <div>
      <CustomNavbar
        isFoodItem
        buttonText={"Go to cart"}
        onAddCallback={() => {
          console.log("on add callback");
          navigate(`/user/cart/${userId}`);
        }}
        onLogoutCallback={doLogout}
        badgeNumber={badgeNumber}
        isProfile
      />
      <SubNavbar title={subNavbarTitle} />
      {foodItems !== undefined && foodItems.length > 0 ? (
        <Grid
          container
          sx={{
            gap: "15px",
            paddingLeft: "15px",
            paddingRight: "15px",
            marginTop: "30px",
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          {foodItems?.map((foodItem) => {
            return (
              <FoodCard
                key={foodItem.id}
                id={foodItem.id}
                name={foodItem.name}
                img={foodItem.image}
                price={foodItem.price}
                forCart
                iconUpdateCallback={() => getItems()}
                cartClickCallback={() => cartClickHandler(foodItem.id)}
              />
            );
          })}
        </Grid>
      ) : (
        <div
          style={{
            textAlign: "center",
            width: "100%",
            display: "block",
            gap: "15px",
            marginTop: "30px",
          }}
        >
          <h2>No Food Items</h2>
        </div>
      )}
    </div>
  );
};
export default UserFoodItemsPage;
