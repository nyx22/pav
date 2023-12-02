import { myAxios } from "../utils/axiosAuth.js";

//change the post api call according to backend
export const getAllCategories = async () => {
	console.log("myaxios: ", myAxios.defaults);
	try {
		const response = await myAxios.get("/foodStall/getAllStalls");
		return response;
	} catch (err) {
		throw err;
	}
};
