import React, { useEffect, useState, useRef } from "react";
import "../css/loading.css";

function Loading_page() {
  const [messages, setmessages] = useState("This may take a while");
  const countRef = useRef(0);

  useEffect(() => {
    const message_arr = [
      "This may take a while",
      "More Documents means more processing",
    ];
    const interval = setInterval(() => {
      setmessages(message_arr[countRef.current]);
      countRef.current = (countRef.current + 1) % message_arr.length
    }, 3000);
    return () => clearInterval(interval)
  }, []);

  return (
    <>
      <h3 id="loading_title" key={messages}>{messages}</h3>
      <div id="loading_bar"></div>
      <div id="blur_cover"></div>
      <div id="blob1"></div>
      <div id="blob2"></div>
      <div id="blob3"></div>
    </>
  );
}

export default Loading_page;
