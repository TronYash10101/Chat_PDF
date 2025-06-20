import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api.js";
import "./css/multiple_upload.css";
import User_info from "../components/user_info.jsx";

function Multiple_Upload() {
  const [files_selected, setfiles_selected] = useState([]);
  const [files_selected_name, setfiles_selected_name] = useState([]);
  const navigate = useNavigate();
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [token, settoken] = useState(null);
  const [pdf_obj, setpdf_obj] = useState([]);

  useEffect(() => {
    const tok = localStorage.getItem("access_token");
    settoken(tok);
    if (tok) {
      setisAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const get_user_pdf = async () => {
      try {
        if (isAuthenticated) {
          const response = await api.get("/user_pdfs", {
            params: {
              is_multiple_frontend: true,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setpdf_obj(response.data["userpdf_obj"]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    get_user_pdf();
  }, [isAuthenticated, token]);

  const handle_change = (event) => {
    const new_file = Array.from(event.target.files);
    setfiles_selected((prev) => [...prev, ...new_file]);
    setfiles_selected_name((prev) => [
      ...prev,
      ...new_file.map((file) => file.name),
    ]);
  };

  const upload_pdfs = async () => {
    const formData = new FormData();

    files_selected.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await api.post("/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/rolling");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const existing_history = async (fileid) => {
    try {
      const his = await api.get(
        "/user_history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            fileid: fileid
          },
        },
      );
      setTimeout(() => {
        navigate("/rolling")
      }, 200);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <User_info />
      <input
        type="file"
        id="upload"
        accept="application/pdf"
        multiple
        onChange={handle_change}
        style={{ display: "none" }}
      />
      <label htmlFor="upload" className="custom-upload-button">
        Select PDFs
      </label>
      <button
        type="submit"
        onClick={upload_pdfs}
        disabled={!isAuthenticated || files_selected.length == 0}
        className="custom-upload-button"
      >
        {!isAuthenticated
          ? "Login OR Signup"
          : files_selected.length == 0
          ? "No Files Uploaded"
          : "Upload"}
      </button>
      <ol id="pdf_listed">
        <h1 id="pdf_list_title">PDF Selected</h1>
        {files_selected_name.map((file, idx) => (
          <li key={idx}>{file}</li>
        ))}
      </ol>
      <div id="blur_cover"></div>
      <div id="previous_multiple_pdf">
        {pdf_obj && Object.entries(pdf_obj).length > 0 ? (
          Object.entries(pdf_obj).map(([id, pdf]) => (
            <button type="button" key={id} value={id} onClick={()=>existing_history(id)} className="pdf_btns_multiple">
              {pdf.name}
            </button>
          ))
        ) : (
          <p>No PDF Uploaded</p>
        )}
      </div>
    </>
  );
}

export default Multiple_Upload;
