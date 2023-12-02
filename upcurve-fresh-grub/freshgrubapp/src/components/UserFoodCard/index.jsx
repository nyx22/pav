import { Box, Typography, Icon, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import getAllItemsInCart from "../../services/Cart/getAllCartItems";
import AddIcon from "@mui/icons-material/Add";
import addToCart from "../../services/Cart/addToCart";
import decrement from "../../services/Cart/decrementItem";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const boxStyles = {
  width: "270px",
  height: "250px",
  //backgroundColor: "#808080",
  backgroundColor: "#343a40",
  display: "flex",
  borderRadius: "10px",
  padding: "2px",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  flexDirection: "column",
  marginLeft: "20px", // Adjust the left margin as needed
  border: "2px solid white", // Add border with black color
  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s", // Add a smooth hover effect
  cursor: "pointer", // Change cursor to pointer on hover
};

const innerBox = {
  paddingTop: "10px",
  paddingLeft: "20px",
  paddingRight: "20px",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  width: "100%",
};

const imageWithBorderStyles = {
  width: "210px",
  height: "140px",
  objectFit: "cover",
  display: "flex",
  borderRadius: "10px",
  //border: "2px solid white",
};

const iconStyles = {
  color: "white",
  fontSize: "25px",
  cursor: "pointer",
};

const quantityIconStyles = {
  color: "white",
  fontSize: "25px",
  cursor: "pointer",
};

const FoodCard = ({
  name,
  price,
  img,
  width = 150,
  height = 150,
  forCart,
  forVendor,
  cartClickCallback,
  onEditCallback,
  onDeleteCallback,
  iconUpdateCallback,
  id,
}) => {
  const [count, setCount] = useState(0);
  const localStorageData = sessionStorage.getItem("data");
  const token = JSON.parse(localStorageData).token;
  const decodedValue = jwtDecode(token);
  console.log("decodedValue: ", decodedValue);
  const userId = decodedValue.id;
  // console.log("userId: ", userId);

  const getItems = async () => {
    const res = await getAllItemsInCart(userId);
    if (res.data?.success) {
      const items = res.data?.cartItems;
      // console.log("res data: ", res.data?.cartItems);
      if (items.length > 0) {
        const cart = items.filter((cart) => cart?.item[0]?.id === id);
        console.log("cart: ", cart);
        if (cart !== undefined && cart.length > 0) {
          setCount(cart[0]?.qty);
        } else {
          console.log("cart not found: ", cart);
          setCount(0);
          // setCount(count > 0 ? count : 0);
        }
      }
    }
  };

  const increment = async (count) => {
    const response = await addToCart(userId, {
      itemId: id,
      qty: count,
      isOrdered: false,
    });
    console.log("increment: ", response);
    // setCount(count+1);
  };

  const decrementThis = async () => {
    try {
      const response = await decrement(userId, { itemId: id });
      console.log("on decrement: ", response);
      if (count > 0) {
        setCount(count - 1);
      }
    } catch (error) {
      console.error("Error while decrementing item :", error);
    }
  };

  useEffect(() => {
    getItems();
    iconUpdateCallback !== undefined && iconUpdateCallback();
  }, [count]);

  const renderButton = () => {
    // console.log("redner: ", count);
    if (count === 0) {
      return (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50",
            fontSize: "16px",
            padding: "3px 20px",
            color: "white",
            borderRadius: "10px",
            fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
            cursor: "pointer",
            transition: "background-color 0.2s, transform 0.2s",
            marginRight: "10px",
          }}
          onClick={() => {
            console.log("ADD BTN click");
            setCount(count + 1);
            increment(count + 1);
          }}
        >
          ADD
        </Button>
      );
    } else if (count > 0) {
      return (
        <Box display="flex" gap="10px" width="100px">
          <RemoveIcon
            sx={iconStyles}
            onClick={() => {
              setCount(count - 1);
              decrementThis();
            }}
          />
          <Typography sx={quantityIconStyles}>{count}</Typography>
          <AddIcon
            sx={iconStyles}
            onClick={() => {
              setCount(count + 1);
              increment(count + 1);
            }}
          />
        </Box>
      );
    }
  };

  return (
    <Box sx={boxStyles}>
      <img
        alt="foodimg"
        src={`data:image/jpeg;base64,${img}`}
        width={width}
        height={height}
        style={imageWithBorderStyles}
      />
      <Typography
        variant="body2"
        color={"white"}
        sx={{ fontSize: "18px", fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif', }}
      >
        {name}
      </Typography>
      <Box sx={innerBox}>
        <Typography
          variant="caption"
          color={"white"}
          sx={{ fontSize: "15px", fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif', }}
        >{`Price : ₹${price}`}</Typography>
        <Box sx={{ display: "flex", gap: "10px" }}>
          {forCart && cartClickCallback ? (
            renderButton()
          ) : forVendor ? (
            <>
              <EditIcon sx={iconStyles} onClick={onEditCallback} />
              <DeleteIcon sx={iconStyles} onClick={onDeleteCallback} />
            </>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default FoodCard;
