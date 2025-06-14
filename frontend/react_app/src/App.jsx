import React, { useState, useEffect, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Upload from "./pages/upload_page";
// import Chat from "./pages/chat_page";
import { Suspense } from "react";

const Upload = lazy(()=>import("./pages/upload_page"))
const Chat = lazy(()=>import("./pages/chat_page"))
const Roling = lazy(()=>import("./pages/rolling_text"))
const Signout = lazy(()=>import("./pages/signout"))
const Login = lazy(()=>import("./pages/login"))
const Landing_Page = lazy(()=>import("./pages/landing_page"))

function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route path="/" element={<Landing_Page />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/rolling" element={<Roling />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
