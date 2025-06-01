import { useState } from "react"
import api from "../api.js";
import { useNavigate,Navigate } from "react-router-dom";

function signup() {
    
    const [new_user,setnew_user] = useState({username: '',
    password: ''})

    const navigate = useNavigate()

    const submit_user = (e)=>{
        setnew_user({...new_user,[e.target.name] : e.target.value})
    }
    const post_user = async(e)=>{
        e.preventDefault();
        try {
            const response = await api.post("/signup",new_user)
            setTimeout(()=>{navigate("/login")},200)
        } catch (error) {
            console.log(error);
        }
    
    }
    
    return(
        <>
        <p>sign up</p>
        <form onSubmit={post_user}></form>
        <input type="text" name="username" placeholder="username" value={new_user.username} onChange={submit_user}/>
        <input type="text" name="password" placeholder="password" value={new_user.password} onChange={submit_user}/>
        <input type="submit" onClick={post_user}></input>
        </>
    )
}

export default signup