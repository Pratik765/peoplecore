import React, { useReducer, useState } from "react";
import { useSelector } from "react-redux";

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE": {
      return { ...state, [action.payload.id]: action.payload.value };
    }
    default: {
      return state;
    }
  }
};
function VerifyOtp() {
  const initialState = {
    otp: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const register = useSelector((store) => store.register);
  const [otpFlag, setOtpFlag] = useState(false);
  const handleChange = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    dispatch({
      type: "CHANGE",
      payload: {
        id,
        value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = { email: register.email, otp: state.otp };
    const otpResp = await fetch("http://localhost:8080/api4/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    if (otpResp.ok) {
      setOtpFlag(true);
    }
    if (otpFlag) {
      const reg = await fetch("http://localhost:8080/api2/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(register),
      });
      const regResp = await reg.json();
      console.log(regResp);
    } else {
      console.log("Invalid or expired OTP");
    }
  };
  return (
    <>
      <center>
        <form className="w-50" onSubmit={handleSubmit}>
          <div className="form-floating my-3">
            <input
              type="text"
              className="form-control"
              id="otp"
              placeholder="Enter your OTP"
              value={state.otp}
              onChange={handleChange}
            />
            <label htmlFor="floatingPassword">Enter your OTP</label>
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit">
            Verify
          </button>
        </form>
      </center>
    </>
  );
}

export default VerifyOtp;
