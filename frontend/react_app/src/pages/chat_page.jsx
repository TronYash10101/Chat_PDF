import { useState } from "react";
import "./css/chat.css";
import api from "../api.js";


function chat() {
    
    const [prompt, setprompt] = useState("");
    const [subprompt, setsubprompt] = useState("");
    const [aimsg,setaimsg] = useState("")
  
      const prompt_change =  (event) =>{
          setprompt(event.target.value)        
      }
      const submitprompt =  async () =>{
          setsubprompt(prompt) 
        const ai_response = await api.post("/query",{ query: prompt })
        setaimsg(ai_response.data["ai_res"]);
        console.log(aimsg);
          
      }
  return (
    <div id="container">
      <p>chat</p>
      <div id="ai_message">
        <div id="hres" className="res">
          <p>{subprompt}</p>
        </div>
        <div id="ares" className="res">
          <p>{aimsg}</p>
        </div>
      </div>

      <div id="interaction">
        <input
          type="text"
          id="prompt_bar"
          placeholder="Enter your prompt"
          onChange={prompt_change}
        ></input>
        <button id="send" onClick={submitprompt}>Send</button>
      </div>
    </div>
  );
}

export default chat;
