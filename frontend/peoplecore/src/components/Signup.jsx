import React, { useReducer } from "react";

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
    try {
      console.log(state);

      const res = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(state),
      });
      const respJson = await res.json();
      console.log(respJson);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <main className="form-signin w-50 m-auto">
      <form onSubmit={handleSubmit}>
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
  );
}

export default Signup;
