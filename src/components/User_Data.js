import React, { useState, useEffect } from "react";
import Alerts from "./Alerts";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "./Loader";
import mongoose from "mongoose";
import { ReactComponent as EditIcon } from "./Edit_Icon.svg";
import { ReactComponent as DeleteIcon } from "./Delete_Icon.svg";
import { useNavigate } from "react-router-dom";

function UserData() {
  const BASE_URL = "https://mern-app-crud-backend.vercel.app";
  const db = "mongodb+srv://afifurrahman444:afif2017@cluster0.nmr1num.mongodb.net/MERNAppData?retryWrites=true&w=majority";
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [newId, setNewId] = useState(null);
  const [button, setButton] = useState(true);
  const [del, setDel] = useState(false);
  const [loader, setLoader] = useState(false);
  const [addData, setAddData] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isError, setIsError] = useState(false);
  const [userData, setUserData] = useState({
    page: 1,
    dataCount: 5,
    totalPages: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    GetUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.dataCount]);

  const handlePaginationClick = async (page) => {
    const userId = localStorage.getItem("User Id");
    if (userData.page === page) {
      return;
    }

    try {
      setLoader(true)
      const API_LINK = `${BASE_URL}/userdata?page=${page}&dataCount=${userData.dataCount}`;
      const token = localStorage.getItem("token");
      const response = await fetch(API_LINK, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "User-Id": userId,
        },
      });
      const result = await response.json();
      setUsers(result.users);
      setUserData({ ...userData, page: page, totalPages: result.totalPages });
      setLoader(false)
    } catch (error) {
      console.error(`Error Fetching the data from ${db}: ${error}`);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleAddData = () => {
    setAddData(true);
  };

  // Alert
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
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
  // Get Request
  const GetUsers = async () => {
    try {
      setLoader(true);
      const API_LINK = `${BASE_URL}/userdata?page=${userData.page}&dataCount=${userData.dataCount}`;
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("User Id");
      const response = await fetch(API_LINK, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "User-Id": id,
        },
      });
      const result = await response.json();
      setUsers(result.users);
      setUserData({ ...userData, totalPages: result.totalPages });
    } catch (error) {
      console.error(`Error Fetching the data from ${db}: ${error}`);
    } finally {
      setLoader(false);
    }
  };

  // Submit Request
  const PostUsers = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (formData.name.length < 4 || !validateEmail(formData.email) || !pass) {
      setIsError(true);
      setLoader(false);
      return;
    }

    const payload = {
      _id: new mongoose.Types.ObjectId(),
      id: localStorage.getItem("User Id"),
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    setUsers((prevUsers) => [
      payload,
      ...prevUsers.slice(0, userData.dataCount - 1),
    ]);

    let API_LINK = `${BASE_URL}/submit`;

    try {
      await fetch(API_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      showAlert(`Saved Successfully`, "success");
      setFormData({ name: "", email: "", password: "" });
      setIsError(false);
      setLoader(false);
      setAddData(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete All Request
  const DeleteAllUsers = async () => {
    setLoader(true);
    setUsers([]);
    const API_LINK = `${BASE_URL}/deleteAll`;
    try {
      const response = await fetch(API_LINK, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setUsers([]);
      setDel(false);
      setNewId(null);
      setFormData({ name: "", email: "", password: "" });
      setButton(true);
      showAlert(
        `Deleted ${result.deletedCount} Entries Successfully`,
        "success"
      );
    } catch (error) {
      console.error(`Error deleting the data from ${db}: ${error}`);
    } finally {
      setLoader(false);
    }
  };

  // Delete One Request
  const DeleteOneUser = async (id) => {
    setLoader(true);
    const API_LINK = `${BASE_URL}/deleteOne`;
    try {
      await fetch(API_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setDel(false);
      setFormData({ name: "", email: "", password: "" });
      setButton(true);
      setNewId(null);
      showAlert(`Deleted Successfully`, "success");
      await GetUsers();
      setLoader(false);
    } catch (error) {
      console.error(`Error deleting the data from ${db}: ${error}`);
    }
  };

  // Set Data to From Request

  const handleEditClick = (id) => {
    setAddData(true);
    const userToEdit = users.find((user) => user._id === id);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      password: userToEdit.password,
    });
    setNewId(id);
    setButton(false);
    window.scrollTo(0, 0);
  };

  // Update Request
  const updateUser = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (formData.name.length < 3 || !validateEmail(formData.email) || !pass) {
      setIsError(true);
      setLoader(false);
      return;
    }

    // Updating Data Locally
    const updatedUser = users.map((user) =>
      user._id === newId
        ? {
            ...user,
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }
        : user
    );
    setUsers(updatedUser);

    // Updating Data in Database
    const API_LINK = `${BASE_URL}/update`;
    try {
      await fetch(API_LINK, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: newId,
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      showAlert("Updated Successfully", "success");
      setFormData({ name: "", email: "", password: "" });
      setNewId(null);
      setButton(true);
      setIsError(false);
      setLoader(false);
      setAddData(false);
    } catch (error) {
      console.error(`Error updating the data from ${db}: ${error}`);
    }
  };

  return (
    <>
      <Alerts alert={alert} />
      {addData && (
        <div
          className="data d-flex flex-column align-items-center justify-content-center"
          autoComplete="off"
        >
          <div>
            <form
              className="container d-flex flex-column justify-content-center"
              method="POST"
              encType="multipart/form-data"
              style={{
                margin: "auto",
                padding: "10px",
                height: "fit-content",
                width: "auto",
                borderRadius: "10px",
                border: "1px solid gray",
                backgroundColor: "whitesmoke",
              }}
            >
              <h5 className="text-center">Add User Info</h5>
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
                    Please Enter valid Email Address{" "}
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
              <div>
                <button
                  disabled={loader}
                  type="submit"
                  className="btn btn-success mx-1"
                  onClick={button ? PostUsers : updateUser}
                >
                  {button ? "Save" : "Update"}
                </button>
                <button
                  type="submit"
                  className="btn btn-danger mx-1"
                  onClick={() => setAddData(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container main">
      {loader && <Loader />}
        <div>
          <span style={{ fontWeight: "bold" }}>Logged In as: </span>{" "}
          <span>{localStorage.getItem("User Name")}</span>
        </div>

        <div>
          <h2 style={{ textAlign: "center" }}>User Info</h2>
        </div>

        <div className="logout">
          <div
            className="form-group my-1"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <label htmlFor="name">Number of Enteries: </label>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              style={{ maxWidth: "20%" }}
              value={userData.dataCount}
              onChange={(e) =>
                setUserData({ ...userData, dataCount: e.target.value, page: 1 })
              }
            />
          </div>

          <div className="my-1">
            <button
              className="btn btn-success mx-1"
              onClick={() => {
                handleAddData();
              }}
            >
              Add Data
            </button>
            <button
              className="btn btn-primary mx-1"
              onClick={() => {
                setLoader(true);
                localStorage.clear();
                navigate("/");
                setLoader(false);
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="container my-2 tablescroll">
          <table className="table table-striped">
            <thead style={{ borderBottom: "1px solid black" }}>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Password</th>
                <th></th>
                <th className="text-right">
                  <span
                    onClick={() => setDel(true)}
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <DeleteIcon />{" "}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((item, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.name}</td>
                    <td>
                      <a href="mailto:">{item.email}</a>
                    </td>
                    <td>{item.password}</td>
                    <td className="text-right">
                      <span
                        onClick={() => handleEditClick(item._id)}
                        style={{ cursor: "pointer" }}
                      >
                        {" "}
                        <EditIcon />{" "}
                      </span>
                    </td>
                    <td>
                      <span
                        onClick={() => {
                          setDel(true);
                          setNewId(item._id);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {" "}
                        <DeleteIcon />{" "}
                      </span>
                      <div
                        className="delOne"
                        style={{
                          display: del ? "block" : "none",
                        }}
                      >
                        {newId
                          ? "Are you sure you want to delete?"
                          : "Are you sure you want to delete all data?"}
                        <div className="align-right">
                          <button
                            className="btn btn-success mt-2 mx-1"
                            onClick={() => {
                              setDel(false);
                              setNewId(null);
                            }}
                          >
                            No
                          </button>
                          <button
                            className="btn btn-danger mt-2 mx-1"
                            onClick={() =>
                              newId ? DeleteOneUser(newId) : DeleteAllUsers()
                            }
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pagination d-block" style={{ textAlign: "center" }}>
          {Array.from(
            { length: userData.totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              className={`btn ${
                page === userData.page ? "btn-primary" : "btn-light"
              } mx-1 my-1`}
              onClick={() => handlePaginationClick(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserData;
