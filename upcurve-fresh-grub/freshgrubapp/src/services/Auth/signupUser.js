// contains all things needed for server calling

import { myAxios } from "../utils/axiosAuth";

//change the post api call according to backend
export const signUp = (signupData) => {
	return myAxios
		.post("/api/v1/users/save", signupData)
		.then((response) => response.data);
};
