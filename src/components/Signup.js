import React, { useState } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "./Loader";
import mongoose from "mongoose";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const BASE_URL = "https://mern-app-crud-backend.vercel.app";
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    _id: new mongoose.Types.ObjectId(),
    name: "",
    email: "",
    password: "",
  });
  const [isError, setIsError] = useState(false);
  const [emailExist, setEmailExist] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Form Validation
  // Email Validation
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Password Validation
  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    const isValid = passwordPattern.test(password);
    const up = /[A-Z]/.test(password);
    const num = /\d/.test(password);
    const char = /[@$!%*?&#]/.test(password);
    const len = password.length >= 8;
    return { isValid, up, num, char, len };
  };

  const validName = isError && formData.name.length < 3;
  const validEmail = isError && !validateEmail(formData.email);
  const pass =
    validatePassword(formData.password).isValid &&
    validatePassword(formData.password).up &&
    validatePassword(formData.password).num &&
    validatePassword(formData.password).char &&
    validatePassword(formData.password).len;

  const validPass = isError && !pass;

  // Sign Up Request
  const SignupUser = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (formData.name.length < 4 || !validateEmail(formData.email) || !pass) {
      setIsError(true);
      setLoader(false);
      return;
    }

    const API_LINK = `${BASE_URL}/signup`;

    try {
      const result = await fetch(API_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (result.ok) {
        const data = await result.json();
        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("User Name", formData.name);
          localStorage.setItem("User Id", data.id);
          navigate("/userdata");
        } else {
          console.error(data.message);
        }
      } else {
        setIsError(true)
        setEmailExist(true)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsError(false);
      setLoader(false);
    }
  };

  return (
    <>
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        autoComplete="off"
      >
        <div className="background">
          <form
            className="container d-flex flex-column justify-content-center"
            method="POST"
            encType="multipart/form-data"
            style={{
              padding: "10px",
              height: "fit-content",
              width: "auto",
              borderRadius: "10px",
              border: "1px solid gray",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {loader && <Loader />}
            <h5 className="text-center">Sign Up</h5>
            <div className="form-group">
              <label htmlFor="name">
                <span style={{ color: "red" }}>*</span>Name:
              </label>
              <input
                type="name"
                className="form-control"
                id="name"
                aria-describedby="name"
                placeholder="Enter Name"
                autoComplete="off"
                required
                style={{
                  border: `2px solid  ${
                    validName
                      ? "rgba(255, 0, 0, 0.8)"
                      : formData.name.length < 3
                      ? "rgba(0, 0, 0, 0.2)"
                      : "green"
                  }`,
                }}
                value={formData.name}
                onChange={handleInputChange}
              />
              {validName && (
                <span
                  style={{
                    fontSize: "14px",
                    color: "rgba(255, 0, 0, 0.8)",
                    fontWeight: "500",
                  }}
                >
                  Please Enter valid name{" "}
                </span>
              )}
              <br />
              <label htmlFor="email">
                <span style={{ color: "red" }}>*</span>Email address:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                placeholder="example@gmail.com"
                autoComplete="off"
                required
                style={{
                  border: `2px solid  ${
                    validEmail
                      ? "rgba(255, 0, 0, 0.8)"
                      : !validateEmail(formData.email)
                      ? "rgba(0, 0, 0, 0.2)"
                      : "green"
                  }`,
                }}
                value={formData.email}
                onChange={handleInputChange}
              />
              {validEmail && (
                <span
                  style={{
                    fontSize: "14px",
                    color: "rgba(255, 0, 0, 0.8)",
                    fontWeight: "500",
                  }}
                >
                  {emailExist ? "Email Already Registered" : "Please Enter valid Email Address"}
                </span>
              )}
              <br />
              <label htmlFor="password">
                <span style={{ color: "red" }}>*</span>Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                autoComplete="off"
                required
                style={{
                  border: `2px solid  ${
                    validPass
                      ? "rgba(255, 0, 0, 0.8)"
                      : !pass
                      ? "rgba(0, 0, 0, 0.2)"
                      : "green"
                  }`,
                }}
                value={formData.password}
                onChange={handleInputChange}
              />

              {validPass && (
                <span
                  style={{
                    fontSize: "14px",
                    color: "rgba(255, 0, 0, 0.8)",
                    fontWeight: "500",
                  }}
                >
                  Please Enter valid Password{" "}
                </span>
              )}
              <br />
              <div style={{ fontSize: "14px" }}>
                <span>Must contain:</span>
                <ul style={{ padding: "0 0 0 20px" }}>
                  <li
                    style={{
                      color: validatePassword(formData.password).up
                        ? "green"
                        : "#212529",
                    }}
                  >
                    1 Uppercase Letter
                  </li>
                  <li
                    style={{
                      color: validatePassword(formData.password).num
                        ? "green"
                        : "#212529",
                    }}
                  >
                    1 Number
                  </li>
                  <li
                    style={{
                      color: validatePassword(formData.password).char
                        ? "green"
                        : "#212529",
                    }}
                  >
                    1 Special character(@ $ ! % * ? & #)
                  </li>
                  <li
                    style={{
                      color: validatePassword(formData.password).len
                        ? "green"
                        : "#212529",
                    }}
                  >
                    Minimum 08 characters
                  </li>
                </ul>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                disabled={loader}
                type="submit"
                className="btn btn-success"
                onClick={SignupUser}
              >
                Sign Up
              </button>
            </div>
            <div style={{ textAlign: "center" }}>
              <p className="my-1">Already have an account?</p>
              <Link to="/"> Login here </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
