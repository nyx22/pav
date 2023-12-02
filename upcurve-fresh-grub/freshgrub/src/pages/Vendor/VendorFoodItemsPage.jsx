import FoodCard from "../../components/UserFoodCard";
import { useState, useEffect } from "react";
import { getAllFoodItems } from "../../services/Foods/getAllFoodItems";
import { useParams, useLocation } from "react-router-dom";
import { getSingleFoodItems } from "../../services/Foods/getSingleFoodItem";
import { deleteFoodItems } from "../../services/Foods/deleteFoodItem";
import { updateFoodItem } from "../../services/Foods/updateFoodItem";
import { validateTokenAndRedirectForVendor } from "../../services/utils/jwtTokenHelper";
import { toast } from "react-toastify";

import {
	Box,
	Grid,
	Typography,
	Autocomplete,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	DialogActions,
} from "@mui/material";
import { addAFoodItem } from "../../services/Foods/addFoodItem";
import {
	Container,
	InputGroup,
	FormControl,
	Form,
	FormGroup,
	Col,
	Row,
	FormCheck,
} from "react-bootstrap";
import SubNavbar from "../../components/SubNavbar";
import { addTokenToHeaders } from "../../services/utils/jwtTokenHelper";
import CustomNavbar from "../../components/Header/index.jsx";
import { doLogout } from "../../auth/index";

const VendorFoodItemsPage = () => {
	const params = useParams();
	const location = useLocation();
	const [error, setError] = useState("");
	//const [subNavbarTitle, setSubNavbarTitle] = useState(location?.state?.name);

	if (location?.state?.name) {
		sessionStorage.setItem("title", location?.state?.name);
	}

	const pageTitle = sessionStorage.getItem("title");

	const dialogStyles = {
		"& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
			width: "400px",
			height: "auto",
			backgroundColor: "#f5f5ed",
		},
	};

	const addDialogStyles = {
		"& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
			width: "550px",
			height: "auto",
			backgroundColor: "#f5f5ed",
		},
	};

	const dialogTitleStyles = {
		//backgroundColor: "#4CAF50",
		fontFamily:
			'"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
		color: "black",
		fontSize: "20px",
	};

	const createButtonStyles = {
		fontFamily:
			'"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
		backgroundColor: "#4CAF50",
		color: "white",
		fontSize: "14px",
		width: "80px",
	};

	const cancelButtonStyles = {
		fontFamily:
			'"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
		backgroundColor: "#f44336",
		color: "white",
		fontSize: "14px",
		width: "80px",
	};

	const textBoxStyles = {
		"& .MuiFormLabel-root, .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input":
			{
				fontFamily:
					'"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
			},
	};

	const [modal, setModal] = useState({
		add: false,
		delete: false,
		edit: false,
	});

	const [foodFormDetails, setFoodFormDetails] = useState({
		categoryName: "",
		foodName: "",
		foodPrice: "",
		picture: "",
	});

	const [editFoodFormDetails, setEditFoodFormDetails] = useState({
		name: "",
		price: "",
		picture: "",
	});

	const [foodItems, setFoodItems] = useState([]);

	const [Id, setId] = useState([]);

	const getAllFoodItemsWrapper = async () => {
		try {
			const response = await getAllFoodItems(params.categoryId);
			console.log("response: ", response?.data?.menuItems);
			setFoodFormDetails((prev) => ({
				...prev,
				categoryName: location?.state?.name,
			}));
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
			setError(err.response.status);
		}
	};

	const getSingleFoodItem = async (id) => {
		const response = await getSingleFoodItems(params.categoryId, id);
		console.log("response: ", response);
		setEditFoodFormDetails({
			id: response?.data?.id,
			name: response?.data?.menuItemName,
			price: response?.data?.price,
			image: response?.data?.menuItemImage,
		});
	};

	useEffect(() => {
		validateTokenAndRedirectForVendor();
		addTokenToHeaders();
		getAllFoodItemsWrapper();
	}, []);

	const imageHandler = (e) => {
		const reader = new FileReader();
		reader.onload = () => {
			setFoodFormDetails((prev) => ({
				...prev,
				picture: [reader.result],
			}));
			// this.setState({
			// 	...this.state.questions,
			// 	picture: [reader.result],
			// });
			// set the picutre
		};

		reader.readAsDataURL(e.target.files[0]);
	};

	const editImageHandler = (e) => {
		const reader = new FileReader();
		reader.onload = () => {
			setEditFoodFormDetails((prev) => ({
				...prev,
				picture: [reader.result],
			}));
		};

		reader.readAsDataURL(e.target.files[0]);
	};

	const onCategoryNameChange = (event) => {
		setFoodFormDetails((prev) => ({
			...prev,
			categoryName: event.target.value,
		}));
	};

	const onFoodNameChange = (event) => {
		setFoodFormDetails((prev) => ({
			...prev,
			foodName: event.target.value,
		}));
	};

	const onPriceChange = (event) => {
		setFoodFormDetails((prev) => ({
			...prev,
			foodPrice: event.target.value,
		}));
	};

  const onCreateHandler = async () => {
    if(foodFormDetails.picture==="")
    {
        toast.error("Please provide an image!", { setTimeout: 2000 });
        return;
    }
    console.log("formData: ", foodFormDetails);
    console.log("cate: ", params.categoryId);
    await addAFoodItem(params.categoryId, foodFormDetails);
    setModal((prev) => ({ ...prev, add: false }));
    await getAllFoodItemsWrapper();
    setFoodFormDetails({
      ...foodFormDetails,
      foodName: "",
      foodPrice: "",
      picture: ""
    });
  };

	const onFoodEditNameChange = (event) => {
		setEditFoodFormDetails((prev) => ({
			...prev,
			name: event.target.value,
		}));
	};

	const onEditPriceChange = (event) => {
		setEditFoodFormDetails((prev) => ({
			...prev,
			price: event.target.value,
		}));
	};

	const onEditHandler = async () => {
		console.log("editformData: ", editFoodFormDetails);
		console.log("cate: ", params.categoryId, Id);
		setModal((prev) => ({ ...prev, edit: false }));
		await updateFoodItem(
			params.categoryId,
			editFoodFormDetails.id,
			editFoodFormDetails
		);
		await getAllFoodItemsWrapper();
	};

	const onDeleteHandler = async () => {
		console.log("formData: ", foodFormDetails);
		setModal((prev) => ({ ...prev, delete: false }));
		await deleteFoodItems(params.categoryId, Id);
		await getAllFoodItemsWrapper();
	};

	const addModalCloseCallback = async () => {
		setModal((prev) => ({ ...prev, add: false }));
		await getAllFoodItemsWrapper();
	};

	const editModalCloseCallback = async () => {
		setModal((prev) => ({ ...prev, edit: false }));
		await getAllFoodItemsWrapper();
	};

	const deleteModalCloseCallback = async () => {
		setModal((prev) => ({ ...prev, delete: false }));
		await getAllFoodItemsWrapper();
	};

	const handleAddClose = () => {
		setModal((prev) => ({ ...prev, add: false }));
	};

	const handleEditClose = () => {
		setModal((prev) => ({ ...prev, edit: false }));
	};

	const handleDeleteClose = () => {
		setModal((prev) => ({ ...prev, delete: false }));
	};

	console.log("arr: ", foodItems);

	return (
		<div>
			<CustomNavbar isProfile />
			<SubNavbar
				title={pageTitle}
				forVendor
				buttonText={"Add Food Item"}
				onAddCallback={() => {
					setModal((prev) => ({ ...prev, add: true }));
				}}
			/>

			{foodItems === undefined || foodItems?.length <= 0 ? (
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
			) : (
				<Grid
					container
					sx={{
						gap: "15px",
						width: "100%",
						paddingLeft: "15px",
						paddingRight: "15px",
						marginTop: "30px",
						flexWrap: "wrap",
						//justifyContent: "center",
						flexDirection: "row",
            marginLeft:"15px",
					}}
				>
					{foodItems?.map((foodItem) => {
						return (
							<FoodCard
								key={foodItem.id}
								name={foodItem.name}
								img={foodItem.image}
								price={foodItem.price}
								onEditCallback={async () => {
									console.log("edit clicked", foodItem.id);
									setId(foodItem.id);
									setModal((prev) => ({ ...prev, edit: true }));
									await getSingleFoodItem(foodItem.id);
								}}
								onDeleteCallback={() => {
									console.log("delete clicked", foodItem.id);
									setId(foodItem.id);
									setModal((prev) => ({ ...prev, delete: true }));
								}}
								forVendor={true}
							/>
						);
					})}
				</Grid>
			)}
			<Dialog sx={addDialogStyles} open={modal.add} onClose={handleAddClose}>
				<DialogTitle sx={dialogTitleStyles}>{"Add a Food Item"}</DialogTitle>
				<DialogContent sx={{ paddingTop: "20px !important" }}>
					<TextField
						disabled
						id='outlined-basic'
						label='Category Name'
						variant='outlined'
						value={foodFormDetails.categoryName}
						onChange={onCategoryNameChange}
						sx={{ ...textBoxStyles, paddingRight: "10px", width: "160px" }}
					/>
					<TextField
						id='outlined-basic'
						label='Food Name'
						variant='outlined'
						value={foodFormDetails.foodName}
						onChange={onFoodNameChange}
						sx={{ ...textBoxStyles, paddingRight: "10px", width: "160px" }}
					/>
					<TextField
						id='outlined-basic'
						label='Price'
						variant='outlined'
						value={foodFormDetails.foodPrice}
						onChange={onPriceChange}
						sx={{ ...textBoxStyles, width: "160px" }}
					/>
					<Form.Group
						style={{
							fontFamily:
								'"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
							width: "480px",
						}}
						className='mb-3'
					>
						<Form.Label>Choose picture</Form.Label>
						<Form.Control type='file' name='image' onChange={imageHandler} />
					</Form.Group>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							onCreateHandler();
						}}
						style={createButtonStyles}
					>
						Add
					</Button>
					<Button
						onClick={() => {
							addModalCloseCallback();
						}}
						style={cancelButtonStyles}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog sx={dialogStyles} open={modal.edit} onClose={handleEditClose}>
				<DialogTitle sx={dialogTitleStyles}>{"Edit a Food Item"}</DialogTitle>
				<DialogContent sx={{ paddingTop: "20px !important" }}>
					<TextField
						id='outlined-basic'
						label='Food Name'
						variant='outlined'
						value={editFoodFormDetails.name}
						onChange={onFoodEditNameChange}
						sx={{ ...textBoxStyles, paddingRight: "10px", width: "160px" }}
					/>
					<TextField
						id='outlined-basic'
						label='Price'
						variant='outlined'
						value={editFoodFormDetails.price}
						onChange={onEditPriceChange}
						sx={{ ...textBoxStyles, width: "160px" }}
					/>
					<Form.Group
						style={{
							fontFamily:
								'"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
							width: "320px",
						}}
						className='mb-3'
					>
						<Form.Label>Choose picture</Form.Label>
						<Form.Control
							type='file'
							name='image'
							onChange={editImageHandler}
							sx={textBoxStyles}
						/>
					</Form.Group>
				</DialogContent>
				<DialogActions>
					<Button onClick={onEditHandler} style={createButtonStyles}>
						Save
					</Button>
					<Button onClick={editModalCloseCallback} style={cancelButtonStyles}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog sx={dialogStyles} open={modal.delete} onClose={handleDeleteClose}>
				<DialogTitle sx={dialogTitleStyles}>{"Delete a Food Item"}</DialogTitle>
				<DialogContent sx={{ paddingTop: "20px !important" }}>
					<Typography>Do you want to delete this ?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={onDeleteHandler} style={cancelButtonStyles}>
						Delete
					</Button>
					<Button onClick={deleteModalCloseCallback} style={createButtonStyles}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default VendorFoodItemsPage;