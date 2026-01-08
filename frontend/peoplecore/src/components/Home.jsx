import React from "react";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((store) => store.user);

  return (
    <>
      <center className="h3 mb-3">Hi, {user.user.name}</center>
    </>
  );
}

export default Home;
