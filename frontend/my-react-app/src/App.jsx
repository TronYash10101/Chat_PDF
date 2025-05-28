import React, { useState, useEffect, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Upload from "./pages/upload_page";
// import Chat from "./pages/chat_page";
import { Suspense } from "react";

const Upload = lazy(()=>import("./pages/upload_page"))
const Chat = lazy(()=>import("./pages/chat_page"))
const Roling = lazy(()=>import("./pages/rolling_text"))

function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/rolling" element={<Roling />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
