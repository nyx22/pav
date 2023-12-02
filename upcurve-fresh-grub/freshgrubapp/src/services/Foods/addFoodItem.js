import { myAxios } from "../utils/axiosAuth.js";

export const addAFoodItem = async (categoryId, foodFormDetails) => {
	console.log("form: ", foodFormDetails);
	try {
		const response = await myAxios.post(
			`/menu/${categoryId}/create`,
			{
				menuItemName: foodFormDetails.foodName,
				price: foodFormDetails.foodPrice,
				menuItemImage: foodFormDetails.picture[0].split(",")[1],
			},
			{
				headers: {
					"content-type": "multipart/form-data",
				},
			}
		);
		return response;
	} catch (err) {
		throw err;
	}
};
