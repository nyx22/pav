import {
	authenticateUser,
	authenticateVendor,
} from "../services/utils/jwtTokenHelper";
import { Link, Navigate } from "react-router-dom";

export const loggedIn = () => {
	const vendor = authenticateVendor();
	const user = authenticateUser();
	if (user.status === true || vendor.status === true) {
		return true;
	}
};
export const isLoggedIn = () => {
	let data = sessionStorage.getItem("data");
	if (data == null) {
		return false;
	} else {
		return true;
	}
};

export const isUserLoggedIn = () => {
	let data = localStorage.getItem("data");
	if (data.role === "user") {
		return true;
	} else {
		return false;
	}
};

export const isVendorLoggedIn = () => {
	let data = localStorage.getItem("data");
	if (data.role === "vendor") {
		return true;
	} else {
		return false;
	}
};

export const getToken = () => {
	let data = sessionStorage.getToken("data");
	console.log("Data ", data);
	return data.token;
};

export const doLogin = (data, next) => {
	sessionStorage.setItem("data", JSON.stringify(data));
	next();
};

export const doLogout = () => {
	sessionStorage.removeItem("data");
	window.location.href = "/";
};

export const getCurrentUserDetails = () => {
	if (isLoggedIn) {
		return JSON.parse(sessionStorage.getItem("data"));
	} else {
		return false;
	}
};

export function NoLoginBack({ children }) {
	const vendor = authenticateVendor();
	const user = authenticateUser();
	if (user.status === true && user.code === 200) {
		return (
			<>
				<Navigate to='/user' />
			</>
		);
	} else if (vendor.status === true && vendor.code === 200) {
		return (
			<>
				<Navigate to='/vendor' />
			</>
		);
	} else {
		return <>{children}</>;
	}
}

export function NoLogoutBack({ children }) {
	const vendor = authenticateVendor();
	const user = authenticateUser();
	if (user.status === true || vendor.status === true) {
		return <>{children}</>;
	} else {
		return (
			<>
				<Navigate to='/' />
			</>
		);
	}
}
