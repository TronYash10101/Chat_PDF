import { useState } from "react";
import api from "../api.js";
import { useNavigate,Navigate } from "react-router-dom";

function login() {
  const [user, setuser] = useState({ username: "", password: "" });
    const navigate = useNavigate()
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
      localStorage.setItem("access_token",jwt_token["data"]["access_token"])
      setTimeout(()=>{navigate("/")},300)
      console.log(jwt_token);
    } catch (error) {
        console.log(error);
        
    }


  };

  return (
    <>
      <p>log in</p>
      <input
        type="text"
        name="username"
        value={user.username}
        onChange={handle_change}
      ></input>
      <input
        type="text"
        name="password"
        value={user.password}
        onChange={handle_change}
      ></input>
      <input type="submit" onClick={login}></input>
    </>
  );
}

export default login;
