import React, { useState } from "react";
import "./css/rolling.css";
import api from "../api.js";

function Rolling() {
  const [chat, setchat] = useState([]);
  const [tempmsg, settempmsg] = useState("");

  const random = async(query) => {
      try {
        const ai_response = api.post("/query", { query: query});
        return ai_response
      } catch (error) {
        
        console.log(error);
        reject(error)
        
      }  
  };
  const text_change = (event) => {
    settempmsg(event.target.value);    
  };
  const send = async () => {
    if (tempmsg.trim() === "") {
      return;
    }

    const newMessage = { You: tempmsg, AI: "..." };
    const newChat = [...chat, newMessage];
    setchat(newChat);
    settempmsg("");

    const ai = await random(tempmsg);

    const updatedmessage = [...chat]
    updatedmessage[updatedmessage - 1].AI = ai
    
    setchat(updatedmessage);
    // console.log([...chat, tempmsg]);
  };

  // const [prompt, setprompt] = useState("");
  // const [subprompt, setsubprompt] = useState("");
  // const [aimsg, setaimsg] = useState("");

  // const prompt_change = (event) => {
  //   setprompt(event.target.value);
  // };
  // const submitprompt = async () => {
  //   setsubprompt(prompt);
  //   const ai_response = await api.post("/query", { query: prompt });
  //   setaimsg(ai_response.data["ai_res"]);
  //   console.log(aimsg);
  // };

  return (
    <>
      <input type="text" id="prompt_bar" onChange={text_change}></input>
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
        Send
      </button>
    </>
  );
}

export default Rolling;
