import { myAxios } from "../utils/axiosAuth";

//change the post api call according to backend
export const login = (loginData) => {
	return myAxios
		.post("/api/v1/users/login", loginData)
		.then((response) => response.data);
};
