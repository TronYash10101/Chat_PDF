import { useState, useRef, useEffect } from "react";
import "./css/upload.css";
import api from "../api.js";
import { Navigate, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { user_context } from "../context.jsx";
import User_info from "../components/user_info.jsx";

function upload({ children }) {
  const fileInputRef = useRef(null);
  const [selectedfile, setselectedfile] = useState(null);
  const [uploaded_file, setuploaded_file] = useState("");
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [token, settoken] = useState("");
  const [pdf_obj, setpdf_obj] = useState({});
  // const context = useContext(user_context);
  // console.log(context);

  const navigate = useNavigate();

  useEffect(() => {
    const tok = localStorage.getItem("access_token");
    settoken(tok);
    if (tok) {
      setisAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const get_user_pdf = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get("/user_pdfs", {
            headers: {
              // "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          setpdf_obj(response.data["userpdf_obj"]);
          console.log(pdf_obj);
        } catch (error) {
          console.log(error);
        }
      }
    };
    get_user_pdf();
  }, [isAuthenticated, token]);

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
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setTimeout(() => navigate("/rolling"), 100);
    } catch (e) {
      console.log(e);
    }
  };

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
        <button
          id="upload_btn"
          onClick={reach_upload_api}
          disabled={!isAuthenticated}
        >
          {!isAuthenticated
            ? "Please log in to upload files"
            : "Upload Your File"}
        </button>
      </div>
      {/* <p>{erromsg}</p> */}
      <div id="history">
        <h1 id="history_title">Your PDFs</h1>
        <div id="pdfs">
        {pdf_obj && Object.entries(pdf_obj).length > 0 ? (
          Object.entries(pdf_obj).map(([id, context]) => (
            <button key={id} value={id} className="pdf_btns">
              {context["name"]}
            </button>
          ))
        ) : (
          <p style={{color : "#ff6500",fontSize : "1.3em"}}>No PDFs uploaded yet.</p>
        )}
        </div>
      </div>
      <User_info />
    </div>
  );
}

export default upload;
