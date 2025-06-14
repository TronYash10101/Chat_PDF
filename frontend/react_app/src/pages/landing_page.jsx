import { useNavigate } from "react-router-dom";
import "./css/landing.css";
import { useState, useEffect } from "react";
import api from "../api.js";
import Credential_error from "./error_pages/credential_error.jsx";
import User_info from "../components/user_info.jsx";

function Landing_Page() {
  const navigate = useNavigate();
  const [new_user, setnew_user] = useState({ username: "", password: "" });
  const [login_error, setlogin_error] = useState(false);
  const [login_error_msg, setlogin_error_msg] = useState("");

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
      setlogin_error_msg(error.message);
      console.log(error);
    }
  };
  if (login_error) {
    return <Credential_error error_msg={login_error_msg} />;
  }
  return (
    <>
      <div id="login_signup">
        <form>
          <div id="handler_div">
            <h3>SignUp</h3>
            <input
              type="text"
              placeholder="Username"
              className="landing_handlers"
              name="username"
              value={new_user.username}
              onChange={handle_change}
              autoComplete="off"
            ></input>
            <input
              type="input"
              placeholder="Password"
              className="landing_handlers"
              name="password"
              value={new_user.password}
              onChange={handle_change}
              autoComplete="off"
            ></input>
            <button
              type="submit"
              className="landing_handlers"
              style={{ fontWeight: "bolder" }}
              onClick={post_user}
            >
              SignUp
            </button>
          </div>
        </form>
      </div>
      <h1 className="chatchphrase">AI Integrated with PDF</h1>
      <h2 className="chatchphrase">Start talking Today</h2>

      <button
        id="login_btn"
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </button>
      <User_info />
      <div id="blur_cover"></div>
      <div id="blob1" className="blob"></div>
      <div id="blob3" className="blob"></div>
      <div id="sub_head1">⋅ ⋅ Also Checkout These Tools ⋅ ⋅</div>
      <div id="prod_container">
        <div className="product"></div>
        <div className="product"></div>
        <div className="product"></div>
      </div>
      <div id="footer">
      <h3 className="footer_element">API</h3>
      <h3 className="footer_element">Donate</h3>
      <h3 className="footer_element">Legal</h3>
      </div>
    </>
  );
}

export default Landing_Page;
