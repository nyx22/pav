import { myAxios } from "../utils/axiosAuth.js";

const decrement = async (userId, cartDetails) => {
	try {
		const response = await myAxios.post(
			`/cart/${userId}/decrease`,
			{},
			{
				params: {
					itemId: cartDetails.itemId,
				},
			}
		);
		return response;
	} catch (err) {
		throw err;
	}
};

export default decrement;
