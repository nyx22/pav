import { myAxios } from "../utils/axiosAuth.js";

const addToCart = async (userId, cartDetails) => {
	console.log("gyujf: ", cartDetails);
	try {
		const response = await myAxios.post(
			`/cart/${userId}/add`,
			{},
			{
				params: {
					itemId: cartDetails.itemId,
					qty: cartDetails.qty,
					isOrdered: cartDetails.isOrdered,
				},
			}
		);
		return response;
	} catch (err) {
		throw err;
	}
};

export default addToCart;

export const decrementItem = async (userId, item) => {
	try {
		const response = await myAxios.post(`/cart/${userId}/decrease`, {
			itemId: item.itemId,
		});
		return response;
	} catch (err) {
		throw err;
	}
};

export const deleteItem = async (userId, item) => {
	try {
		const response = await myAxios.delete(`/cart/${userId}/remove`, {
			name: item.itemId,
		});
		return response;
	} catch (err) {
		throw err;
	}
};
