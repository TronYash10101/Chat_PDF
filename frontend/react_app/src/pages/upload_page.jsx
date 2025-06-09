import { useState, useRef, useEffect } from "react";
import "./css/upload.css";
import api from "../api.js";
import { Navigate, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { user_context } from "../context.jsx";
import { jwtDecode } from "jwt-decode";

function upload({ children }) {
  const fileInputRef = useRef(null);
  const [selectedfile, setselectedfile] = useState(null);
  const [uploaded_file, setuploaded_file] = useState("");
  const [user_info_display, setuser_info_display] = useState(false);
  const [username,setusername] = useState("Not Loged In")
  // const context = useContext(user_context);
  // console.log(context);

  const navigate = useNavigate();

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const catch_pdf = (event) => {
    const file = event.target.files[0];
    if (file) {
      setselectedfile(file);
      setuploaded_file(file.name);
    } else {
      setselectedfile(null);
      setuploaded_file("None");
    }
  };

  const reach_upload_api = async () => {
    try {
      if (!selectedfile) {
        alert("Select a file");
      }
      const formData = new FormData();
      formData.append("file", selectedfile);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTimeout(() => navigate("/rolling"), 100);
    } catch (e) {
      console.log(e);
    }
  };

  // const show_user_info = async () => {
  //   setuser_info_display((prev) => !prev);
  //   const token = localStorage.getItem("access_token");
  //   if (token) {
  //     const user_name = await api.get("/user_history", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log(user_name);
  //   }
  // };

  const jwtdecode = ()=>{
    setuser_info_display((prev) => !prev);
    const jwt = localStorage.getItem("access_token")
    const user_name = jwtDecode(jwt)["sub"]
    setusername(user_name);
  }

  return (
    <div id="container">
      <div id="main_interaction">
        <p id="upload_title">Chat With PDF</p>
        <div id="cover" onClick={handleBoxClick}>
          <p id="uploaded_file">
            {selectedfile ? "Selected File: " : "Upload Here"}
            {uploaded_file}
          </p>
        </div>
        <input
          type="file"
          id="upload_file"
          accept="application/pdf"
          onChange={catch_pdf}
          ref={fileInputRef}
        />
        <button id="upload_btn" onClick={reach_upload_api}>
          UPLOAD
        </button>
      </div>
      {/* <p>{erromsg}</p> */}
      <div id="history"></div>
      <button id="pf" onClick={jwtdecode}>
        {user_info_display ? "" : ""}
      </button>
      {user_info_display && (
        <div id="user_info">
          <p id="loged_user">{username}</p>
        </div>
      )}
    </div>
  );
}

export default upload;
