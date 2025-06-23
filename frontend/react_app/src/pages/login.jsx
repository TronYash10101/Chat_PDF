import { useContext, useState, useEffect } from "react";
import api from "../api.js";
import { useNavigate, Navigate } from "react-router-dom";
import "./css/login.css";
import Credential_error from "./miscellaneous_pages/credential_error.jsx";

function Login() {
  const [user, setuser] = useState({ username: "", password: "" });
  const [login_error, setlogin_error] = useState(false);
  const [login_error_msg, setlogin_error_msg] = useState("");
  const navigate = useNavigate();

  
  const handle_change = (e) => {
    setuser({ ...user, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", user.username);
      formData.append("password", user.password);

      const jwt_token = await api.post("/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("access_token", jwt_token["data"]["access_token"]);

      setTimeout(() => {
        navigate("/upload");
      }, 300);
    } catch (error) {
      setlogin_error(true);
      setlogin_error_msg(error.message);
      console.log(login_error_msg);
    }
  };
  if (login_error) {
    return <Credential_error error_msg={login_error_msg} />;
  }

  return (
    <>
      <div id="title">
        <h1 style={{ color: "#FF6500" }}>Welcome Back!</h1>
      </div>
      <div id="login_form">
        <h1 style={{ color: "#FF6500" }}>Log In</h1>
        <input
          type="text"
          name="username"
          className="handlers"
          value={user.username}
          onChange={handle_change}
          placeholder="Username"
          autoComplete="off"
        ></input>
        <input
          className="handlers"
          type="password"
          name="password"
          value={user.password}
          placeholder="Password"
          onChange={handle_change}
          autoComplete="off"
        ></input>
        <button className="handlers" type="submit" onClick={login}>
          Login
        </button>
      </div>
    </>
  );
}

export default Login;
