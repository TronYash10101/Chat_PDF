import React, { useState } from "react";
import "./css/rolling.css";
// import api from "../api.js";

function Rolling() {
  const [chat, setchat] = useState([]);
  const [tempmsg, settempmsg] = useState("");

  const random = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const num = Math.floor(Math.random() * 100);
        resolve(num);
      }, 1000);
    });
  };
  const text_change = (event) => {
    settempmsg(event.target.value);
  };
  const send = async () => {
    if (tempmsg.trim() === "") {
      return;
    }
    const num = await random();
    setchat([...chat, { You: tempmsg, AI: num }]);
    console.log([...chat, tempmsg]);
  };

  return (
    <>
      <input type="text" id="prompt_bar" onChange={text_change}></input>
      <ul>
        {chat.map((chat, idx) => (
          <React.Fragment key={idx}>
            <li key={idx}>
              <div id="human_message">{chat["You"]}</div>
            </li>
            <li key={idx}>
              <div id="ai_message">{chat["AI"]}</div>
            </li>
          </React.Fragment>
        ))}
      </ul>
      
      <button id="submit" onClick={send}>
        Send
      </button>
    </>
  );
}

export default Rolling;
