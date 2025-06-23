import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Option from "./option.jsx"
import Authenticate_request from "./authenticate_request.jsx"

function Portal() {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [token, settoken] = useState("");

  useEffect(() => {
    const tok = localStorage.getItem("access_token");
    settoken(tok);
    if (tok) {
      setisAuthenticated(true);
    }
  }, []);

  return (
  <>
  {isAuthenticated ? <Option/> : <Authenticate_request/>}
  </>
);
}

export default Portal;
