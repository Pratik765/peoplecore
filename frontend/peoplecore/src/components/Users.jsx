import React, { useState } from "react";
import useFetch from "../hooks/useFetch";

function Users() {
  const token = localStorage.getItem("token");
  const { state, error, loading } = useFetch(
    "http://localhost:5001/api/admin/users"
  );
  return (
    <>
      {loading && <h1>Loading</h1>}
      {error && <h1>{error}</h1>}
      {token ? (
        <div className="container">
          <h1 className="h3 mb-3">All users</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Sr.No</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Active</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.users.map((u, i) => {
                return (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.isActive.toString()}</td>
                    <td>
                      {u.status == "ACCEPTED" ? (
                        <span className="badge text-bg-success">
                          {u.status}
                        </span>
                      ) : (
                        <span className="badge text-bg-warning">
                          {u.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <center className="h3 mb-3">Please login first</center>
      )}
    </>
  );
}

export default Users;
