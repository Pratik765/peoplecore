import React, { useReducer } from "react";
import { useDispatch } from "react-redux";
import { userAction } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const reducer = (currentState, action) => {
  switch (action.type) {
    case "CHANGE": {
      return { ...currentState, [action.payload.id]: action.payload.value };
    }
    default: {
      return currentState;
    }
  }
};

function Login() {
  const initialState = {
    email: "",
    password: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await fetch("http://localhost:5000/pc/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(state),
    });
    const res = await data.json();
    localStorage.setItem("token", `Bearer ${res.token}`);
    reduxDispatch(userAction.login(res));
    navigate("/home");
  };
  return (
    <main className="form-signin w-50 m-auto">
      <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3">Please sign in</h1>
        <div className="form-floating my-3">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="name@example.com"
            value={state.email}
            onChange={handleChange}
          />
          <label htmlFor="email">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="form-check text-start my-3">
          <input
            className="form-check-input"
            type="checkbox"
            value="remember-me"
            id="checkDefault"
          />
          <label className="form-check-label" htmlFor="checkDefault">
            Remember me
          </label>
        </div>
        <button className="btn btn-primary w-100 py-2" type="submit">
          Log in
        </button>
        {/* <p className="mt-5 mb-3 text-body-secondary">© 2017–2025</p> */}
      </form>
    </main>
  );
}

export default Login;
