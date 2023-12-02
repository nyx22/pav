import CustomNavbar from "../../components/Header";
import { useState, useEffect } from "react";
import { getAllFoodItems } from "../../services/Foods/getAllFoodItems";
import MenuPack from "../../components/CategoriesList";
import Loading from "../../components/Loading/loading";
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

	if (location?.state?.name) {
		sessionStorage.setItem("title", location?.state?.name);
	}

	const pageTitle = sessionStorage.getItem("title");

	const localStorageData = sessionStorage.getItem("data");
	const token = JSON.parse(localStorageData).token;
	const decodedValue = jwtDecode(token);
	console.log("decodedValue: ", decodedValue);
	const userId = decodedValue.id;
	console.log("userId: ", userId);

	const [totalItems, setTotalItems] = useState(0);

	const [loading, setLoading] = useState(false);

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
				setLoading(false);
			}
		} catch (err) {
			console.log("err: ", err);
		}
	};

	useEffect(() => {
		setLoading(true);
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
			getItems();
		}
	};

	if (loading) {
		return <Loading />;
	}

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
			<SubNavbar title={pageTitle} />
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
						marginLeft:"10px",
						//justifyContent: "center",
						"@media (min-width: 321px)": {
							paddingLeft: "30px",
							paddingRight: "30px",
						},

						"@media (min-width: 376px)": {
							paddingLeft: "50px",
							paddingRight: "50px",
						},
						"@media (min-width: 426px)": {
							paddingLeft: "20px",
							paddingRight: "20px",
						},
						"@media (min-width: 601px) and (max-width: 1024px)": {
							paddingLeft: "20px",
							paddingRight: "20px",
						},
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