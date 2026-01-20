import React from "react";
import useFetch from "../hooks/useFetch";

function Profile() {
  const { state } = useFetch("http://localhost:5004/user/me");
  console.log(state);
  return <div>Profile</div>;
}

export default Profile;
