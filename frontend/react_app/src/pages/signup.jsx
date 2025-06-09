import { useState } from "react";
import api from "../api.js";
import { useNavigate, Navigate } from "react-router-dom";
import "./css/signup.css";
import Credential_error from "./error_pages/credential_error.jsx";

function Signup() {
  const [new_user, setnew_user] = useState({ username: "", password: "" });
  const [login_error, setlogin_error] = useState(false);
  const [login_error_msg, setlogin_error_msg] = useState("");
  const navigate = useNavigate();

  const handle_change = (e) => {
    setnew_user({ ...new_user, [e.target.name]: e.target.value });
  };
  const post_user = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/signup", new_user);

      setTimeout(() => {
        navigate("/login");
      }, 200);
    } catch (error) {
      setlogin_error(true);
      setlogin_error_msg(error.message) 
      console.log(error);
    }
  };
  if (login_error) {
    return <Credential_error error_msg={login_error_msg} />;
  }
  return (
    <>
      <div id="title_signup">
        <p id="catch_pharse">Start Chating With Your PDF</p>
        <p id="catch_pharse_today">Today</p>
      </div>

      <div id="signup_form">
        <h1>Sign up</h1>
        <form onSubmit={post_user}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={new_user.username}
            onChange={handle_change}
            className="handlers"
            autoComplete="off"
          />
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={new_user.password}
            onChange={handle_change}
            className="handlers"
            autoComplete="off"
          />
          <button type="submit" className="handlers">
            Sign up
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
