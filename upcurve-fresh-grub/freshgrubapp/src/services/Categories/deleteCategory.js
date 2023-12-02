import { myAxios } from "../utils/axiosAuth.js";

//change the post api call according to backend
export const deleteCategories = async (id) => {
	try {
		const response = await myAxios.delete(`/foodStall/delete/${id}`);
		return response;
	} catch (err) {
		throw err;
	}
};
