import { myAxios } from "../utils/axiosAuth.js";

//change the post api call according to backend
export const createCategory = async (categoryData) => {
	try {
		const response = await myAxios.post("/foodStall/create", {
			name: categoryData.name,
			description: categoryData.description,
			image: categoryData.picture[0].split(",")[1],
		});
		return response;
	} catch (err) {
		throw err;
	}
};
