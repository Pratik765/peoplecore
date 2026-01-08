import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import Modal from "./Modal";

function PendingRequest() {
  const [state, setState] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showReject, setShowReject] = useState(false);

  const loadData = () => {
    try {
      fetch("http://localhost:5002/api/admin/account-approval", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((data) => data.json())
        .then((res) => setState(res.pendingUsers));
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleChange = (id, role) => {
    setState((prev) => {
      return prev.map((u) => {
        return u._id == id ? { ...u, role } : u;
      });
    });
  };
  const handleAccept = async (id, role) => {
    try {
      const response = await fetch(
        `http://localhost:5002/api/admin/approve-user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ role }),
        }
      );
      const res = await response.json();
      console.log(res);
      loadData();
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5002/api/admin/reject-user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const res = await response.json();
      console.log(res);
      loadData();
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <>
      <Modal
        show={showModal}
        title="Confirm Approval"
        message={`Are you sure you want to approve ${selectedUser?.name} as ${selectedUser?.role}?`}
        confirmText="Approve"
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          handleAccept(selectedUser._id, selectedUser.role);
          setShowModal(false);
        }}
      />
      <Modal
        show={showReject}
        title="Reject User"
        message={`Reject approval request of ${selectedUser?.name}?`}
        confirmText="Yes"
        cancelText="No"
        onClose={() => setShowReject(false)}
        onConfirm={() => {
          handleReject(selectedUser?._id);
          setShowReject(false);
        }}
      />

      <div className="container">
        {state.length === 0 ? (
          <center className="h5 mb-3">No pending request(s)</center>
        ) : (
          <>
            <h3 className="h3 mb-3">Approval request(s)</h3>
            <p className=" mb-3">Total: {state.length}</p>
            <table className="table table-hover">
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
                          className="form-select"
                          aria-label="Default select example"
                          value={u.role}
                          onChange={(e) => handleChange(u._id, e.target.value)}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="HR">HR</option>
                          <option value="EMPLOYEE">EMPLOYEE</option>
                        </select>
                      </td>
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
                      <td>
                        <button
                          type="button"
                          className="btn btn-success btn-sm me-2"
                          onClick={() => {
                            setSelectedUser(u);
                            setShowModal(true);
                          }}
                        >
                          Accept
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setSelectedUser(u);
                            setShowReject(true);
                          }}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}

export default PendingRequest;
