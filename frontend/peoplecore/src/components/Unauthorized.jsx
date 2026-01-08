import React from "react";

function Unauthorized() {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">403</h1>
      <h4>Unauthorized Access</h4>
      <p>You don’t have permission to view this page.</p>
    </div>
  );
}

export default Unauthorized;
