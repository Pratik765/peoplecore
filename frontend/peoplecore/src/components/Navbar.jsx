import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-2 border-bottom px-2 mb-5">
      <div class="col-md-3 mb-2 mb-md-0">
        <a href="/" class="d-inline-flex text-decoration-none h5 text-primary">
          PeopleCore
        </a>
      </div>
      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
          <a href="#" class="nav-link px-2 link-secondary">
            Home
          </a>
        </li>
        <li>
          <a href="#" class="nav-link px-2">
            Features
          </a>
        </li>
        <li>
          <a href="#" class="nav-link px-2">
            Pricing
          </a>
        </li>
        <li>
          <a href="#" class="nav-link px-2">
            FAQs
          </a>
        </li>
        <li>
          <a href="#" class="nav-link px-2">
            About
          </a>
        </li>
      </ul>
      <div class="col-md-3 text-end">
        <Link to="/" type="button" class="btn btn-primary me-2">
          Login
        </Link>
        <Link to="/signup" type="button" class="btn btn-primary">
          Sign-up
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
