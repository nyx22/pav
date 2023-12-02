import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import BodyTemplate from "../../templates/BodyTemplate";
import { createCategory } from "../../services/Categories/createCategory";
import { deleteCategories } from "../../services/Categories/deleteCategory";
import { getAllCategories } from "../../services/Categories/getAllCategories";
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
import SubNavbar from "../SubNavbar";
import { addTokenToHeaders } from "../../services/utils/jwtTokenHelper";
import "./menu-pack.css";
import { Form } from "react-bootstrap";

const categoryBoxStyles = {
	width: "260px",
	height: "250px",
	//backgroundColor: "#959595",
	backgroundColor: "#343a40",
	display: "flex",
	borderRadius: "10px",
	padding: "2px",
	justifyContent: "center",
	alignItems: "center",
	flexWrap: "wrap",
	flexDirection: "column",
	//border: "2px solid black",
	border: "1px solid #ddd",
	boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
	transition: "transform 0.2s", // Add a smooth hover effect
	cursor: "pointer", // Change cursor to pointer on hover
};

const categoryNameStyles = {
	fontSize: "25px", // Increase font size
	//fontWeight: "bold", // Make the text bold
	marginTop: "10px", // Add space between image and text
	//fontFamily: "fangsong",
	fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
	color: "white",
};

const categoryImageStyles = {
	width: "200px", // Increase image width
	height: "170px", // Increase image height
	objectFit: "cover", // Preserve image aspect ratio
	display: "flex",
	borderRadius: "10px",
	//border: "2px solid black",
	border: "2px solid #333",
};

const categoriesContainerStyles = {
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "flex-start", // Align items starting from left
	gap: "20px", // Add gap between category boxes
	marginTop: "30px",
};

const MenuPack = ({ title, items }) => {
	const [filter, setFilter] = useState(""); //for filtering categories
	const navigate = useNavigate();

	const [modal, setModal] = useState({
		//to control modal dialogs
		add: false,
		delete: false,
	});
	const [formData, setFormData] = useState({
		// to store category creation data
		name: "",
		description: "",
		picture: "",
	});
	const [deleteId, setDeleteId] = useState(""); //to store the ID of the category to be deleted.
	const [categories, setCategories] = useState([]); //to store an array of category objects.

	const getAllCategoriesWrapper = async () => {
		//makes an API call to getAllCategories and updates the categories state with the data.
		const response = await getAllCategories();
		console.log("response: ", response);
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
		addTokenToHeaders();
		getAllCategoriesWrapper();
	}, []);

	const onCreateHandler = async () => {
		console.log("formData: ", formData);
		await createCategory(formData);
		getAllCategoriesWrapper();
		setModal((prev) => ({ ...prev, add: false }));
	};

	const onDeleteHandler = async (id) => {
		console.log("delete Id: ", deleteId);
		await deleteCategories(deleteId);
		getAllCategoriesWrapper();
		setModal((prev) => ({ ...prev, delete: false }));
	};

	const imageHandler = (e) => {
		const reader = new FileReader();
		reader.onload = () => {
			console.log("Image Data :", reader.result);

			setFormData((prev) => ({
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

	const onNameChange = (event) => {
		setFormData({ ...formData, name: event.target.value });
	};

	const onDescriptionChange = (event) => {
		setFormData({ ...formData, description: event.target.value });
	};

	const addModalCloseCallback = () => {
		console.log("onclose");
		setModal((prev) => ({ ...prev, add: false }));
		setFormData({ name: "", description: "", picture: "" });
	};

	const deleteModalCloseCallback = () => {
		setModal((prev) => ({ ...prev, delete: false }));
	};
	const location = useLocation();
	const isVendorHome = location.pathname.includes("/vendor");

	return (
		<BodyTemplate>
			{isVendorHome ? (
				<SubNavbar
					forVendor
					title={"Categories"}
					buttonText={"Add Category"}
					secondButtonText={"Delete Category"}
					onAddCallback={() => {
						setModal((prev) => ({ ...prev, add: true }));
					}}
					onDeleteCallback={() => {
						setModal((prev) => ({ ...prev, delete: true }));
					}}
				/>
			) : (
				<SubNavbar title={"Categories"} />
			)}
			<section>
				<Container>
					<Row>
						<Col lg='12' className='text-center mb-5'>
							<div style={categoriesContainerStyles}>
								{categories?.map((val) => (
									<Box
										key={val.id}
										className={`filter-box ${
											filter === val.name ? "active__box" : ""
										}category-box`}
										onClick={() => {
											setFilter(val.name);
											navigate(`${val.id}`, { state: { name: val.name } });
										}}
										sx={categoryBoxStyles}
									>
										<img
											src={`data:image/jpeg;base64,${val.image}`}
											alt={val.name}
											className='category-image'
											style={categoryImageStyles}
										/>
										<Typography
											variant='body1'
											className='category-name'
											style={categoryNameStyles}
										>
											{val.name}
										</Typography>
									</Box>
								))}
							</div>
						</Col>
					</Row>
				</Container>
			</section>
			<Dialog open={modal.add} onClose={addModalCloseCallback}>
				<DialogTitle>{"Create a Category"}</DialogTitle>
				<DialogContent>
					<TextField
						id='outlined-basic'
						label='Name'
						variant='outlined'
						value={formData.name}
						onChange={onNameChange}
					/>
					<TextField
						id='outlined-basic'
						label='Description'
						variant='outlined'
						value={formData.description}
						onChange={onDescriptionChange}
					/>
					<Form.Group className='mb-3'>
						<Form.Label>Choose picture</Form.Label>
						<Form.Control type='file' name='image' onChange={imageHandler} />
					</Form.Group>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={
							formData?.name === "" || formData?.name === undefined
								? true
								: false
						}
						onClick={onCreateHandler}
						//style={addButtonStyles}
					>
						Create
					</Button>
					<Button onClick={addModalCloseCallback}>Cancel</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={modal.delete} onClose={deleteModalCloseCallback}>
				<DialogTitle>{"Delete a Category"}</DialogTitle>
				<DialogContent>
					<Autocomplete
						id='combo-box-demo'
						options={categories}
						renderOption={(props, option) => <li {...props}>{option.name}</li>}
						sx={{ width: 300 }}
						onChange={(event, newValue) => {
							console.log(newValue);
							if (newValue !== null) {
								setDeleteId(newValue.id);
							} else {
								setDeleteId(null);
							}
						}}
						getOptionLabel={(option) => {
							return option.name;
						}}
						renderInput={(params) => <TextField {...params} label='Category' />}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={deleteId === null || deleteId === "" ? true : false}
						onClick={onDeleteHandler}
						//style={deleteButtonStyles}
					>
						Delete
					</Button>
					<Button onClick={deleteModalCloseCallback}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</BodyTemplate>
	);
};

export default MenuPack;
