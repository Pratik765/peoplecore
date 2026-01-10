import React, { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const reducer = (reducerState, action) => {
  switch (action.type) {
    case "CHANGE": {
      return { ...reducerState, [action.payload.id]: action.payload.value };
    }
    default: {
      return reducerState;
    }
  }
};

function Signup() {
  const initialState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [loginModal, setLoginModal] = useState(false);
  const [error, setError] = useState(false);
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

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/pc/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });

      // const respJson = await res.json();

      if (!res.ok) {
        // backend error (409, 400, etc.)
        setError(true);
        setLoginModal(true);
        return;
      }

      // success case
      setLoginModal(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      {error ? (
        <Modal
          show={loginModal}
          title="Account creation failed"
          message={`User already exists, try another email address`}
          confirmText="Ok"
          onClose={() => setLoginModal(false)}
          onConfirm={() => {
            setLoginModal(false);
          }}
        />
      ) : (
        <Modal
          show={loginModal}
          title="Account created"
          message={`Click on Login button`}
          confirmText="Login"
          cancelText="Stay here"
          onClose={() => setLoginModal(false)}
          onConfirm={() => {
            setLoginModal(false);
            navigate("/");
          }}
        />
      )}

      <main className="form-signin w-50 m-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
            setLoginModal(true);
          }}
        >
          <h1 className="h3 mb-3">Please sign up</h1>
          <div className="form-floating my-3">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Jhon Doe"
              value={state.name}
              onChange={handleChange}
            />
            <label htmlFor="floatingInput">Name</label>
          </div>
          <div className="form-floating my-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              value={state.email}
              onChange={handleChange}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating my-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="form-floating my-3">
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm password"
              value={state.confirmPassword}
              onChange={handleChange}
            />
            <label htmlFor="floatingPassword">Confirm password</label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign up
          </button>
          {/* <p className="mt-5 mb-3 text-body-secondary">© 2017–2025</p> */}
        </form>
      </main>
    </>
  );
}

export default Signup;
