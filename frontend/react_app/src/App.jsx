import React, { useState, useEffect, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Upload from "./pages/upload_page";
// import Chat from "./pages/chat_page";
import { Suspense } from "react";

const Upload = lazy(()=>import("./pages/upload_page"))
const Chat = lazy(()=>import("./pages/chat_page"))
const Roling = lazy(()=>import("./pages/rolling_text"))
const Signup = lazy(()=>import("./pages/signup"))
const Login = lazy(()=>import("./pages/login"))

function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/rolling" element={<Roling />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
