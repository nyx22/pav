import { myAxios } from "./axiosAuth";
import jwtDecode from "jwt-decode";

export const addTokenToHeaders = () => {
	myAxios.defaults.headers.post["Content-Type"] =
		"application/json;charset=utf-8";
	myAxios.defaults.headers["Authorization"] = `Bearer ${
		JSON.parse(sessionStorage.getItem("data")).token
	}`;
};

export const decodeJwtToken = (token) => {
	console.log("Token: ", token);
	let decodedheader = jwtDecode(token);
	console.log("decoded Token: ", decodedheader);
	return decodedheader;
};

export const authenticateUser = () => {
	const token = JSON.parse(sessionStorage.getItem("data"))?.token;
	let decodedData = token ? jwtDecode(token) : undefined;
	if (decodedData?.role === "user") {
		return { status: true, code: 200 };
	} else if (decodedData?.role === "vendor") {
		return { status: true, code: 403 };
	} else {
		return { status: false, code: 401 };
	}
};

export const authenticateVendor = () => {
	const token = JSON.parse(sessionStorage.getItem("data"))?.token;
	let decodedData = token ? jwtDecode(token) : undefined;
	if (decodedData?.role === "user") {
		return { status: true, code: 403 };
	} else if (decodedData?.role === "vendor") {
		return { status: true, code: 200 };
	} else {
		return { status: false, code: 401 };
	}
};

export const validateTokenAndRedirect = () => {
	const response = authenticateUser();
	console.log("response: ", response);
	switch (response.code) {
		case 403:
			window.location.href = "/unauthorized";
			break;
		case 401:
			window.location.replace("/login");
			break;
		default:
			break;
	}
};

export const validateTokenAndRedirectForVendor = () => {
	const response = authenticateVendor();
	console.log("response: ", response);
	switch (response.code) {
		case 403:
			window.location.href = "/unauthorized";
			break;
		case 401:
			window.location.replace("/login");
			break;
		default:
			break;
	}
};
