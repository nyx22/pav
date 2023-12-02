
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
	if (data.role=="user") {
	  return true;
	} else {
	  return false;
	}
  };

  export const isVendorLoggedIn = () => {
	let data = localStorage.getItem("data");
	if (data.role=="vendor") {
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
