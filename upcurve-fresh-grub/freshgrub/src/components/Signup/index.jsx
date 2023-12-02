import React, { useState } from "react";
import "../Login/login.css";
import { Link } from "react-router-dom";
import { signUp } from "../../services/Auth/signupUser";
import { toast } from "react-toastify";
import { FormFeedback } from "reactstrap";
import styles from "../../pages/body.module.css";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../Header/index.jsx";
import emailjs from "emailjs-com";
import { validEmail, validNumber, validName, validPassword, validVID } from "./regex";
emailjs.init("nb6C9nKBfQBC0OAAi");

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: "",
    adminId: "",
    vendorId: "",
    otp: "", // New state for OTP
  });
  const [otpSent, setOtpSent] = useState(false); // New state to track OTP sent
  const [otp, setOtp] = useState(""); // New state to store OTP
  const navigate = useNavigate();
  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //submitting the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validName.test(formData.firstName)){
      toast.error("Please provide valid first name!");
      return;
    }

    if(!validNumber.test(formData.mobileNumber)){
      toast.error("Please provide valid mobile number!");
      return;
    }

    if(!validEmail.test(formData.email)){
      toast.error("Please provide valid email address!");
      return;
    }

    if(formData.role==="vendor" && !validVID.test(formData.vendorId)){
      toast.error("Please provide valid vendorID!");
      return;
    }

    if(!validPassword.test(formData.password)){
      toast.error("Please provide a password with atleast 1 uppercase, 1 lowercase and 1 digit with minimum of 6 characters!");
      return;
    }

    if (formData.role === "vendor" && formData.vendorId.length === 0) {
      toast.error("Please provide Vendor ID.");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Minimum 8 characters required");
      return;
    }

    if (!otpSent) {
      //sendOTPByEmail();
	  toast.error("Please click on send OTP to enter OTP before you signup");
    } else {
      if (formData.otp.length !== 6) {
        toast.error("Please enter a 6-digit OTP.");
        return;
      }

      if (parseInt(otp, 10) !== parseInt(formData.otp, 10)) {
		console.log("Entered OTP is:",formData.otp)
        toast.error("Invalid OTP. Please try again.");
        return;
      }

      try {
        const response = await signUp(formData);
        console.log(response);
        if (response === "Registered Successfully!") {
			toast.success("Registered Successfully");
          navigate("/login");
        } else if (response === "Email already registered!") {
          toast.error("Email already registered!");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const sendOTPByEmail = async (email, otp) => {
    try {
		if (otpSent) {
		  toast.success("OTP already sent to your email, please check.");
		  return;
		}
  
		const randomOtp = generateOTP();
		setOtp(randomOtp);
  
		const templateParams = {
		  to_email: formData.email,
		  otp: randomOtp.toString(),
		};

      // Replace with your email service and template IDs
      const serviceId = "service_ldix41f";
      const templateId = "template_zyr4cm2";

      await emailjs.send(serviceId, templateId, templateParams);

      setOtpSent(true);
      toast.success("OTP sent successfully, please check your email.");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };
  return (
    <div>
      <CustomNavbar />

      <div
        className="signup template d-flex justify-content-center align-items-center vh-100 bg-primary"
        class={styles.imagelog}
      >
        <div
          className="form_container p-5 rounded mx-auto"
          style={{
            textAlign: "left",
            backgroundColor: "#343a40",
            fontFamily:
              '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
          }}
        >
          <form
            className="form_control"
            onSubmit={handleSubmit}
            style={{ color: "white", fontSize: "15px" }}
          >
            <h2 className="text-center" style={{marginTop:"30px"}}> Sign up</h2>

            <div className="mb-2">
              <label htmlFor="fname" style={{ paddingBottom: "4px" }}>
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter First name"
                className="form-control"
                name="firstName"
                id="fname"
                pattern="[A-Za-z ]+"
                required
                value={formData.firstName}
                onChange={handleChange}
                invalid={
                  error.errors?.response?.formData?.firstName ? true : false
                }
              />
              <FormFeedback>
                {error.errors?.response?.formData?.firstName}
              </FormFeedback>
            </div>

            <div className="mb-2">
              <label htmlFor="lname" style={{ paddingBottom: "4px" }}>
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                className="form-control"
                name="lastName"
                id="lname"
                value={formData.lastName}
                onChange={handleChange}
                invalid={
                  error.errors?.response?.formData?.lastName ? true : false
                }
              />
              <FormFeedback>
                {error.errors?.response?.formData?.lastName}
              </FormFeedback>
            </div>

            <div className="mb-2">
              <label htmlFor="email" style={{ paddingBottom: "4px" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="form-control"
                name="email"
                id="email"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                required
                value={formData.email}
                onChange={handleChange}
                invalid={error.errors?.response?.formData?.email ? true : false}
              />
              <FormFeedback>
                {error.errors?.response?.formData?.email}
              </FormFeedback>
            </div>

            <div className="mb-2">
              <label htmlFor="mobileNumber" style={{ paddingBottom: "4px" }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="form-control"
                name="mobileNumber"
                id="mobileNumber"
                pattern="[0-9]{10}"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                invalid={
                  error.errors?.response?.formData?.mobileNumber ? true : false
                }
              />
              <FormFeedback>
                {error.errors?.response?.formData?.mobileNumber}
              </FormFeedback>
            </div>

            <div className="mb-2">
              <label htmlFor="password" style={{ paddingBottom: "4px" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="form-control"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                invalid={
                  error.errors?.response?.formData?.password ? true : false
                }
              />
              <FormFeedback>
                {error.errors?.response?.formData?.password}
              </FormFeedback>
            </div>

            <div className="mb-2">
              <label htmlFor="role" style={{ paddingBottom: "4px" }}>
                Select Role
              </label>
              <select
                className="form-control"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="user" style={{ padding: "4px" }}>
                  Employee/Student
                </option>
                <option value="vendor" style={{ padding: "4px" }}>
                  Vendor
                </option>
              </select>
            </div>

            {formData.role === "admin" && (
              <div className="mb-2">
                <label htmlFor="adminId" style={{ paddingBottom: "4px" }}>
                  Admin ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Admin ID"
                  className="form-control"
                  name="adminId"
                  value={formData.adminId}
                  onChange={handleChange}
                  invalid={
                    error.errors?.response?.formData?.adminId ? true : false
                  }
                />
                <FormFeedback>
                  {error.errors?.response?.formData?.adminId}
                </FormFeedback>
              </div>
            )}

            {formData.role === "vendor" && (
              <div className="mb-2">
                <label htmlFor="vendorId" style={{ paddingBottom: "4px" }}>
                  Vendor ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Vendor ID"
                  className="form-control"
                  name="vendorId"
                  value={formData.vendorId}
                  onChange={handleChange}
                  invalid={
                    error.errors?.response?.formData?.vendorId ? true : false
                  }
                />
                <FormFeedback>
                  {error.errors?.response?.formData?.vendorId}
                </FormFeedback>
              </div>
            )}
			
              
            
            <div className="mb-2">
              <label htmlFor="otp" style={{ paddingBottom: "4px" }}>
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                className="form-control"
                name="otp"
                id="otp"
                value={formData.otp}
                onChange={handleChange}
				//onClick={sendOTPByEmail}
              />
              <FormFeedback></FormFeedback>
            </div>

            
            <div className="d-flex justify-content-between mt-2" style={{ paddingTop: "4px" }}>
			<button
                className="btn "
                style={{
                  fontSize: "12px",
                  padding: "6px 12px",
                  backgroundColor: "green",
                  color: "white",
                }}
				type="button"
				onClick={sendOTPByEmail}
              >
                 Send OTP
              </button>
              <button
                className="btn "
                style={{
                  fontSize: "12px",
                  padding: "6px 12px",
                  backgroundColor: "orange",
                  color: "black",
				  width:"250px"
                }}
                onClick={handleSubmit} // You can define the click event handler
              >
                Sign Up
              </button>
            </div>
            <p className="text-end mt-2">
              Already registered?{" "}
              <Link to="/login" className="ms-2" style={{ color: "orange" }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
