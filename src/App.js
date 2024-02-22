/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserData from "./components/User_Data";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isToken, setIsToken] = useState(!!token);

  useEffect(() => {
      setIsToken( !!token === true? true : false);
  }, [token]);

  useEffect(() => {
    if (!isToken) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {isToken && <Route path="/userdata" element={<UserData />} />}
      </Routes>
    </>
  );
}

export default App;