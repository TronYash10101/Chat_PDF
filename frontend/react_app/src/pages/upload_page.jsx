import { useState,useRef,useEffect } from "react";
import "./css/upload.css";
import api from "../api.js";
import { Navigate, useNavigate } from "react-router-dom";

function upload() {

  const fileInputRef = useRef(null);
  
  const [selectedfile, setselectedfile] = useState(null);
  const [uploaded_file,setuploaded_file] = useState("None")
  // const [erromsg, seterromsg] = useState(" ");

  const navigate = useNavigate();
  
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };
  
  const catch_pdf = (event) => {
    const file = event.target.files[0];
    if (file) {
      setselectedfile(file)
      setuploaded_file(file.name);
    }
    else{
      setselectedfile(null)
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
      setTimeout(() => navigate("/chat"), 100);
    } catch (e) {
        console.log(e);      
    }
  };

  return (
    <div id="container">
      <p id="title">Chat With PDF</p>
      <div id="cover" onClick={handleBoxClick}>
        <p id="uploaded_file">Selected File: {uploaded_file}</p>
      </div>
      <input type="file" id="upload_file" accept="application/pdf" onChange={catch_pdf} ref={fileInputRef}/>
      <button id="upload_btn" onClick={reach_upload_api}>
        UPLOAD
      </button>
      {/* <p>{erromsg}</p> */}
    </div>
  );
}

export default upload;
