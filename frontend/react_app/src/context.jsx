import { createContext, useEffect, useState } from "react";
import api from "./api.js";

export const user_context = createContext(null);

const Provider = ({ children }) => {
  const [context, setcontext] = useState("no token");

  useEffect(() => {
    const fetch = async () =>{
    const token = localStorage.getItem("access_token");
    if (token) {
      const user_name = await api.get("/user_history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setcontext(user_name["context"]);
    }
    }
    fetch()
  }, []);

  return (
    <user_context.Provider value={{ context }}>
      {children}
    </user_context.Provider>
  );
};

export default Provider;
