import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./css/rolling.css";

function Rolling() {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://127.0.0.1:8000/query",
    { shouldReconnect: () => true }
  );
  const [message_history, setmessage_history] = useState([]);
  const [tempmsg, settempmsg] = useState("");
  const [chat, setchat] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (lastMessage != null) {
      const token = lastMessage.data;

      setmessage_history((prev) => {
        const last = [...prev];
        last[last.length - 1] = (last[last.length - 1] || "") + token;
        return last;
      });
      setchat((prev) => {
        const up_chat = [...prev];
        up_chat[up_chat.length - 1]["AI"] =
          message_history[message_history.length - 1];
          setIsGenerating(false)
        return up_chat;
      });
      
      
    }
  }, [lastMessage]);

  const text_change = (event) => {
    settempmsg(event.target.value);
  };

  const send = async () => {

    if (tempmsg.trim() === "") return;
    
    setmessage_history((prev) => [...prev, ""]);
    sendMessage(tempmsg);
    setIsGenerating(true)

    const newMessage = { You: tempmsg, AI: "..." };
    setchat((prev_chat) => [...prev_chat, newMessage]);

    setchat((prev) => {
      const up_chat = [...prev];
      up_chat[up_chat.length - 1]["You"] = tempmsg;
      return up_chat;
    });
    settempmsg(""); // Optional: clear input field

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      send();
    }
  };
  console.log(readyState);
  
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

      <button id="submit" onClick={send} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Send"}
      </button>
    </>
  );
}

export default Rolling;
