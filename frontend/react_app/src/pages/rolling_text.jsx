import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./css/rolling.css";
import api from "../api.js";

function Rolling() {
  const [chat, setchat] = useState([]);
  const [tempmsg, settempmsg] = useState("");

  
  const text_change = (event) => {
    settempmsg(event.target.value);
  };
   
  const send = async () => {
    if (tempmsg.trim() === "") {
      return;
    }
    const userMessage = tempmsg; 
    settempmsg(""); 

    const newMessage = { You: userMessage, AI: "..." };
    setchat((prev_chat) => [...prev_chat, newMessage]);
    try {
      const ai = await ai_endpoint(userMessage);
      
      // const ai = await random(userMessage);
      setchat((prev_chat_after_add) => {
        const updated_chat = [...prev_chat_after_add];
        if (updated_chat.length > 0) {
          updated_chat[updated_chat.length - 1]["AI"] = ai.data["ai_res"]
        }
        return updated_chat;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      send();
    }
  };

  return (
    <>
      <textarea
        type="text"
        id="prompt_bar"
        onChange={text_change}
        autoComplete="off"
        onKeyDown={handleKeyDown}
      ></textarea>
      <ul>
        {chat.map((chat, idx) => (
          <React.Fragment key={idx}>
            <li>
              <div id="human_message">{chat["You"]}</div>
            </li>
            <li>
              <div id="ai_message">{chat["AI"]}</div>
            </li>
          </React.Fragment>
        ))}
      </ul>

      <button id="submit" onClick={send}>
        ⬆
      </button>
    </>
  );
}

export default Rolling;
