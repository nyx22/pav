import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { doLogin } from "../../auth";
import { login } from "../../services/Auth/loginUser";
import "./login.css";
import styles from "../../pages/body.module.css";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../Header/index.jsx";
import { decodeJwtToken } from "../../services/utils/jwtTokenHelper";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const handleChange = (event, field) => {
    let actualValue = event.target.value;
    setFormData({
      ...formData,
      [field]: actualValue,
    });
  };

  //submitting the form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email.trim() === "" || formData.password.trim() === "") {
      toast.error("Email or password is empty");
      return;
    }
    if (formData.password.trim() < 8) {
      toast.error("minimum 8 characters required");
      return;
    }

    //call to server to generate token
    login(formData)
      .then((data) => {
        console.log("success log");
        console.log(data);
        //to save data to localStorage
        doLogin(data, () => {
          const decodedData = decodeJwtToken(
            JSON.parse(sessionStorage.getItem("data")).token
          );
          console.log("login detail is saved to localStorage", decodedData);
          //redirecting to user home page
          if (decodedData.role === "user") {
            console.log("decodedData: ", decodedData);
            navigate("/user", { state: { userData: decodedData } });
          }
          //redirecting to vendor home page
          else if (decodedData.role === "vendor") {
            console.log("decodedData: ", decodedData);
            navigate("/vendor", { state: { userData: data } });
          } else {
            toast.error("Something went wrong");
          }
        });

        setFormData({
          email: "",
          password: "",
        });
      })
      .catch((error) => {
        console.log(error);
        console.log("error log");
        if (error.response.status === 400 || error.response.status === 404) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }

        //handling errors
        setError({
          errors: error,
          isError: true,
        });
      });
  };

  // ---------Prevent user form going back from home apge to login page-------------------

  window.history.forward();
  function noBack() {
    window.history.forward();
  }

  // --------------------------------------------------------------------------------

  return (
    <div>
      <CustomNavbar />
      <div
        className="login template d-flex justify-content-center align-items-center vh-100 bg-primary"
        class={styles.imagelog}
      >
        <div
          className="form_container p-5 rounded mx-auto"
          style={{ textAlign: "left", backgroundColor: "#343a40" }}
        >
          <form onSubmit={handleSubmit} style={{ color: "white",fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif'}}>
            <h2 className="text-center">Sign in</h2>
            <div className="mb-3">
              <label htmlFor="email" className="pb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="form-control"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange(e, "email")}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="pb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="form-control"
                id="password"
                value={formData.password}
                onChange={(e) => handleChange(e, "password")}
              />
            </div>
            <div className="d-grid">
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "orange" }}
              >
                Sign in
              </button>
            </div>
            <p className="text-end mt-4">
              Not yet Registered?
              <Link to="/signup" className="ms-2" style={{ color: "orange" }}>
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
