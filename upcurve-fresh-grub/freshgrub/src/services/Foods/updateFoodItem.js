import { myAxios } from "../utils/axiosAuth";

export const updateFoodItem = async (categoryId, foodId, updatedBody) => {
	console.log("üpdated body: ", updatedBody);
	try {
		const response = await myAxios.patch(`/menu/${categoryId}/edit/${foodId}`, {
			menuItemName: updatedBody.name,
			price: updatedBody.price,
			menuItemImage:
				updatedBody.picture !== undefined
					? updatedBody.picture[0].split(",")[1]
					: null,
		});
		return response;
	} catch (err) {
		console.log("err: " + err);
		throw err;
	}
};
