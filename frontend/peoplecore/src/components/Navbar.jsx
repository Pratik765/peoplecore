import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar() {
  const user = useSelector((store) => store.user);
  return (
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-2 border-bottom px-2 mb-5">
      <div className="col-md-3 mb-2 mb-md-0">
        <a
          href="/"
          className="d-inline-flex text-decoration-none h5 text-primary"
        >
          PeopleCore
        </a>
      </div>
      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
          <a href="#" className="nav-link px-2 link-secondary">
            Home
          </a>
        </li>

        {user.user?.role === "ADMIN" && (
          <>
            <li>
              <Link to="/users" className="nav-link px-2">
                Users
              </Link>
            </li>
            <li>
              <Link to="/pending-request" className="nav-link px-2">
                Pending request
              </Link>
            </li>
          </>
        )}
        <li>
          <a href="#" className="nav-link px-2">
            Features
          </a>
        </li>
        <li>
          <a href="#" className="nav-link px-2">
            Pricing
          </a>
        </li>
        <li>
          <a href="#" className="nav-link px-2">
            FAQs
          </a>
        </li>
        <li>
          <a href="#" className="nav-link px-2">
            About
          </a>
        </li>
      </ul>
      {!user.user?.name ? (
        <div className="col-md-3 text-end">
          <Link to="/" type="button" className="btn btn-primary me-2">
            Login
          </Link>
          <Link to="/signup" type="button" className="btn btn-primary">
            Sign-up
          </Link>
        </div>
      ) : (
        <div className="col-md-3 text-end">
          <h6>{user.user?.name}</h6>
        </div>
      )}
    </header>
  );
}

export default Navbar;
