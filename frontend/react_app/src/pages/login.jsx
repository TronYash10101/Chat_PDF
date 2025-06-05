import { useContext, useState } from "react";
import api from "../api.js";
import { useNavigate, Navigate } from "react-router-dom";
import "./css/login.css";


function login() {
  const [user, setuser] = useState({ username: "", password: "" });
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
      if (!jwt_token) {
        localStorage.setItem("access_token", jwt_token["data"]["access_token"]);
      }  
      
      setTimeout(() => {
        navigate("/upload");
      }, 300);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div id="title">
      <h1>Welcome Back!</h1>
    </div>
      <div id="login_form">
        <h1>Log In</h1>
        <input
          type="text"
          name="username"
          className="handlers"
          value={user.username}
          onChange={handle_change}
          placeholder="Username"
        ></input>
        <input
          className="handlers"
          type="text"
          name="password"
          value={user.password}
          placeholder="Password"
          onChange={handle_change}
        ></input>
        <button className="handlers" type="submit" onClick={login}>Login</button>
      </div>
    </>
  );
}

export default login;
