import React from "react";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((store) => store.user);
  console.log(user);

  return <></>;
}

export default Home;
