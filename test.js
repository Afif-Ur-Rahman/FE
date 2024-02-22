import React, { useState, useEffect } from "react";
import Alerts from "./components/Alerts";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "./components/Loader";

function App() {
  const BASE_URL = "http://localhost:5000";
  const db = "mongodb://localhost:27017/Demo";
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [newId, setNewId] = useState(null);
  const [button, setButton] = useState(true);
  const [del, setDel] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    GetUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
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
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@#]+$/;
    return emailPattern.test(email);
  };

  // Password Validation
  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/;
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
      const API_LINK = `${BASE_URL}/users`;
      const response = await fetch(API_LINK, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setUsers(result);
    } catch (error) {
      console.error(`Error Fetching the data from ${db}: ${error}`);
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

    let API_LINK = `${BASE_URL}/submit`;

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

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
    } catch (error) {
      console.error(error);
    } finally {
      setIsError(false);
      setLoader(false);
    }
  };

  // Delete All Request
  const DeleteAllUsers = async () => {
    setLoader(true);
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
      setNewId(null)
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
      setLoader(false);
    } catch (error) {
      console.error(`Error deleting the data from ${db}: ${error}`);
    }
  };

  // Set Data to From Request
  const setOldData = (userData) => {
    setFormData({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
  };

  const handleEditClick = async (id) => {
    setNewId(id);
    setLoader(true);

    try {
      const API_LINK = `${BASE_URL}/users/${id}`;
      const response = await fetch(API_LINK, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userData = await response.json();
      setOldData(userData);
      setButton(false);
      setLoader(false);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(`Error fetching user data: ${error}`);
    }
  };

  // Update Request
  const updateOneUser = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (formData.name.length < 4 || !validateEmail(formData.email) || !pass) {
      setIsError(true);
      setLoader(false);
      return;
    }

    const API_LINK = `${BASE_URL}/edit`;
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
    } catch (error) {
      console.error(`Error updating the data from ${db}: ${error}`);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Alerts alert={alert} />
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        autoComplete="off"
        style={{ height: "100vh" }}
      >
        <div className="background">
          <form
            className="container d-flex flex-column justify-content-center"
            method="POST"
            encType="multipart/form-data"
            style={{
              height: "80vh",
              margin: "auto",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <h5 className="text-center">User Info</h5>
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
                  border: `2px solid  ${validPass? "rgba(255, 0, 0, 0.8)": !pass? "rgba(0, 0, 0, 0.2)": "green"}`,
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
                className="btn btn-success"
                onClick={button ? PostUsers : updateOneUser}
              >
                {button ? "Save" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="container">
        <table className="table table-striped">
          <thead style={{ borderBottom: "1px solid black" }}>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th></th>
              <th className="text-right">
                <svg
                  onClick={() => setDel(true)}
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="14"
                  fill={!users.length ? "rgba(0, 0, 0, 0.3)" : "#000"}
                  viewBox="0 0 448 512"
                  style={{ cursor: "pointer" }}
                >
                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
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
                    <svg
                      onClick={() => handleEditClick(item._id)}
                      height="18"
                      width="16"
                      viewBox="0 0 512 512"
                      style={{ cursor: "pointer" }}
                    >
                      <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                    </svg>
                  </td>
                  <td>
                    <svg
                      onClick={() => {
                        setDel(true);
                        setNewId(item._id);
                      }}
                      height="16"
                      width="14"
                      viewBox="0 0 448 512"
                      style={{ cursor: "pointer" }}
                    >
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
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
    </>
  );
}

export default App;
