import { myAxios } from "../utils/axiosAuth.js";

const remove = async (userId, cartDetails) => {
	try {
		const response = await myAxios.post(
			`/cart/${userId}/remove`,
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

export default remove;
