import { myAxios } from "../utils/axiosAuth.js";

const placeOrder = async (userId, price) => {
	try {
		const response = await myAxios.post(
			`/user/checkout/${userId}/place`,
			{},
			{
				params: {
					orderAmount: price,
				},
			}
		);
		console.log("called method");
		return response;
	} catch (err) {
		throw err;
	}
};

export default placeOrder;
