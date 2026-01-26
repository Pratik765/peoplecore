import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const user = useSelector((store) => store.user);

  const loadData = () => {
    fetch(
      `http://localhost:8080/api1/leaverequest/getById?mongoid=${user.user.id}`
    )
      .then((res) => res.json())
      .then((res) => setLeaves(res));
  };

  useEffect(() => {
    loadData();
  }, []);
  //   console.log(leaves);
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api1/leaverequest/delete?lrid=${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Delete failed");
        }
        console.log("Leave deleted");
        // return res;
      })
      .then(() => {
        loadData();
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="container">
        <h3 className="h3 mb-3">My applied leaves</h3>
        <p className=" mb-3">Total: {leaves.length}</p>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No</th>
              <th scope="col">Leave type</th>
              <th scope="col">Start date</th>
              <th scope="col">End date</th>
              <th scope="col">Remark</th>
              <th scope="col">Applied at</th>
              <th scope="col">Operations</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l, i) => {
              return (
                <tr key={i}>
                  <th>{i + 1}</th>
                  <td>{l.leaveType.type}</td>
                  <td>{l.start_date}</td>
                  <td>{l.end_date}</td>
                  <td>{l.remark}</td>
                  <td>{l.applied_at}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(l.lrid)}
                    >
                      Delete
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

export default MyLeaves;
