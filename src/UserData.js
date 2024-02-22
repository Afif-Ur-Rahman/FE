import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function UserData() {
  const [users, setUsers] = useState([]);

  const GetUsers = async () => {
    const API_LINK = "http://localhost:5000/users";
    try {
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

  useEffect(() => {
    GetUsers();
  }, []);

  const DeleteAllUsers = async () => {
    const API_LINK = "http://localhost:5000/delete";
    try {
      const response = await fetch(API_LINK, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const result = await response.json();
      setUsers(result)
    } catch (error) {
      console.error(`Error deleting the data from ${db}: ${error}`);
    }
  }


  return (
    <>
      <div className="container">
        <table className="table table-striped">
          <thead style={{ borderBottom: "1px solid black" }}>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.password}</td>
                  <td className="text-right">
                    <svg onClick={DeleteAllUsers}
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="14"
                      viewBox="0 0 448 512"
                    >
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
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

export default UserData;