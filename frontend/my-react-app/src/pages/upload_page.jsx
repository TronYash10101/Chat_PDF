import { useState,useRef } from "react";
import "./css/upload.css";
import api from "../api.js";
import { Navigate, useNavigate } from "react-router-dom";

function upload() {

  const fileInputRef = useRef(null);
  
  const [selectedfile, setselectedfile] = useState(null);
  const [erromsg, seterromsg] = useState(" ");

  const navigate = useNavigate();

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const catch_pdf = (event) => {
    setselectedfile(event.target.files[0]);
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
      setTimeout(() => navigate("/chat"), 100);
    } catch (e) {
        console.log(e);      
    }
  };

  return (
    <div id="container">
      <p id="title">Chat With PDF</p>
      <div id="cover" onClick={handleBoxClick}></div>
      <input type="file" id="upload_file" accept="application/pdf" onChange={catch_pdf} ref={fileInputRef}/>
      <button id="upload_btn" onClick={reach_upload_api}>
        UPLOAD
      </button>
      <p>{erromsg}</p>
    </div>
  );
}

export default upload;
