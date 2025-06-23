function Credential_error({error_msg}) {
    return(
        <>
        <div style={{display : "flex",justifyContent:"center",alignItems:"center"}}>
        <p style={{color:"white",position:"absolute",left:"20vw",top:"36vh",fontWeight:"lighter",fontSize:"5em",fontFamily:"system-ui, -apple-system, BlinkMacSystemFont, Roboto"}}>{error_msg}</p>
        </div>
        </>
    )
}
export default Credential_error;