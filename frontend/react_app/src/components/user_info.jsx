import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "../pages/css/upload.css";

function User_info() {
  const [username, setusername] = useState("Not Loged In");
  const [user_info_display, setuser_info_display] = useState(false);
  const navigate = useNavigate()

  const to_login = () => {
    navigate("/login");
  };
  const to_signout = () => {
    navigate("/signout");
  };

  const jwtdecode = () => {
    setuser_info_display((prev) => !prev);
    const jwt = localStorage.getItem("access_token");
    const user_name = jwtDecode(jwt)["sub"];
    setusername(user_name);
  };
  return (
    <>
      <button id="pf" onClick={jwtdecode}>
        {user_info_display ? "" : ""}
      </button>
      {user_info_display && (
        <div id="user_info">
          <p id="loged_user">{username}</p>
          <button className="handlers_comp" onClick={to_login}>
            Login
          </button>
          <button className="handlers_comp"  onClick={to_signout}>
            Sign Out
          </button>
        </div>
      )}
    </>
  );
}

export default User_info;
