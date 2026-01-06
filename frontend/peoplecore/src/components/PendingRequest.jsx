import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

function PendingRequest() {
  const [state, setState] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5001/api/admin/account-approval", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((data) => data.json())
      .then((res) => setState(res.pendingUsers));
  }, []);
  return (
    <>
      <div className="container">
        <h1 className="h3 mb-3">Approval request list</h1>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Active</th>
              <th scope="col">Status</th>
              <th scope="col">Operations</th>
            </tr>
          </thead>
          <tbody>
            {state.map((u, i) => {
              return (
                <tr key={i}>
                  <th>{i + 1}</th>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      class="form-select"
                      aria-label="Default select example"
                    >
                      <option selected>Select role</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="HR">HR</option>
                      <option value="EMPLOYEE">EMPLOYEE</option>
                    </select>
                  </td>
                  <td>{u.isActive.toString()}</td>
                  <td>
                    {u.status == "ACCEPTED" ? (
                      <span className="badge text-bg-success">{u.status}</span>
                    ) : (
                      <span className="badge text-bg-warning">{u.status}</span>
                    )}
                  </td>
                  <td>
                    <button type="button" class="btn btn-success btn-sm me-2">
                      Accept
                    </button>
                    <button type="button" class="btn btn-danger btn-sm">
                      Reject
                    </button>
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

export default PendingRequest;
