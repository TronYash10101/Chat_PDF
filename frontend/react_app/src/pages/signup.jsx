import { useState } from "react";
import api from "../api.js";
import { useNavigate, Navigate } from "react-router-dom";
import "./css/signup.css";

function signup() {
  const [new_user, setnew_user] = useState({ username: "", password: "" });

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
      console.log(error);
    }
  };

  return (
    <>
      <div id="title_signup">
        <p id="catch_pharse">Start Chating With Your PDF</p>
        <p id="catch_pharse_today">Today</p>
      </div>
     
      <div id="signup_form">
        <h1>Sign up</h1>
        <form onSubmit={post_user}></form>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={new_user.username}
          onChange={handle_change}
          class="handlers"
          autocomplete="off"
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          value={new_user.password}
          onChange={handle_change}
          class="handlers"
          autocomplete="off"
        />
        <button type="submit" onClick={post_user} class="handlers">Sign up</button>
      </div>
    </>
  );
}

export default signup;
