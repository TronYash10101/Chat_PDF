function Credential_error({error_msg}) {
    return(
        <>
        <div style={{display : "flex",justifyContent:"center",alignItems:"center"}}>
        <p style={{color:"#ff6500",position:"absolute",left:"20vw",top:"36vh",fontWeight:"bolder",fontSize:"5em"}}>{error_msg}</p>
        </div>
        </>
    )
}
export default Credential_error;