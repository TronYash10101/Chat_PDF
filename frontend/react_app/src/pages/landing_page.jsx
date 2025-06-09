import { useNavigate } from "react-router-dom";
import "./css/landing.css";
import { useState } from "react";
import api from "../api.js";
import Credential_error from "./error_pages/credential_error.jsx";
import User_info from "../components/user_info.jsx";

function Landing_Page() {
  const navigate = useNavigate()
  const [new_user,setnew_user] = useState({ username: "", password: "" })
  const [login_error, setlogin_error] = useState(false);
  const [login_error_msg, setlogin_error_msg] = useState("");
  const handle_change = (e) =>{
    setnew_user({ ...new_user, [e.target.name]: e.target.value })
  }
  const post_user = async(e) =>{
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
  }
  if (login_error) {
    return <Credential_error error_msg={login_error_msg} />;
  }
  return (
    <>
      <div id="login_signup">
        <form>
            <div id="handler_div">
            <h3>SignUp</h3>
            <input type="text" placeholder="Username" className="landing_handlers" name="username" value={new_user.username} onChange={handle_change} autoComplete="off"></input>
            <input type="input" placeholder="Password" className="landing_handlers" name="password" value={new_user.password} onChange={handle_change} autoComplete="off"></input>
            <button type="submit" className="landing_handlers" style={{fontWeight:"bolder"}} onClick={post_user}>SignUp</button>
            </div>
        </form>
      </div>
      <h1 className="chatchphrase">AI Integrated with PDF</h1>
      <h2 className="chatchphrase">Start talking Today</h2>
      <div className="custom-shape-divider-bottom-1749358636">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
    </svg>
</div>
      <button id="login_btn" onClick={()=>{navigate("/login")}}>Login</button>
      <div id="end">
        <h1 style={{color:"white"}}>Video Section</h1>
      </div>
    <User_info/>
    </>
  );
}

export default Landing_Page;
