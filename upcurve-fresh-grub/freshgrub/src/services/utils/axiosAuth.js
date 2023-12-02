//all constant variables
import axios from "axios";

//change according to backend server port
export const BASE_URL = "http://localhost:8081";

export const myAxios = axios.create({
	baseURL: BASE_URL,
});
