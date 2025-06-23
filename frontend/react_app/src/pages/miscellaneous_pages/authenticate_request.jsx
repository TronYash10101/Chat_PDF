import "./authenticate_request.css";

function Authenticate_request() {
  return (
    <>
      <div id="main_box">
        <h1 className="text_auth">Login or Signup</h1>
        <h2 className="text_auth">To continue please login or signup</h2> 
        <button className="handlers">Login</button>
        <button className="handlers">Signup</button>
      </div>
      <div id="blur"></div>
    </>
  );
}
export default Authenticate_request;
