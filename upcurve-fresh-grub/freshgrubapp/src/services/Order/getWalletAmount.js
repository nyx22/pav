import { myAxios } from "../utils/axiosAuth.js";

const getWalletAmount = async (userId) => {
	try {
		const response = await myAxios.get(`/user/checkout/${userId}/walletAmount`);
		// console.log(userId + "from service");
		return response;
	} catch (err) {
		throw err;
	}
};

export default getWalletAmount;
