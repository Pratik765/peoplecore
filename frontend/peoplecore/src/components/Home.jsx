import React from "react";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((store) => store.user);
  const token = localStorage.getItem("token");

  return (
    <>
      {token ? (
        <center className="h3 mb-3">Hi, {user.user.name}</center>
      ) : (
        <center className="h3 mb-3">Please login first</center>
      )}
    </>
  );
}

export default Home;
