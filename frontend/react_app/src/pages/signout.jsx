import { useState } from "react";
import api from "../api.js";
import "./css/signout.css";
import Credential_error from "./miscellaneous_pages/credential_error.jsx";
import { useNavigate, Navigate } from "react-router-dom";


function Signup() {
  const [login_error, setlogin_error] = useState(false);
  const [login_error_msg, setlogin_error_msg] = useState("");
  const navigate = useNavigate()

  const signout = () => {
    try {
      if (localStorage.getItem("access_token")) {
        localStorage.removeItem("access_token");
      }
    } catch (error) {
      setlogin_error(true);
      setlogin_error_msg(error.message);
    }
    if (login_error) {
      return <Credential_error error_msg={login_error_msg} />;
    }
    navigate("/")
  };
  return (
    <>
      <div id="title_signup">
        <p id="catch_pharse">Start Chating With Your PDF</p>
        <p id="catch_pharse_today">Today</p>
      </div>

      <div id="signup_form">
        <h1>Sign Out</h1>
        <form onSubmit={signout}>
          <button type="submit" className="handlers">
            Signout
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
