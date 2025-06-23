import "./option.css";
import multiple_pdf_image from "./multiple_image.png";
import single_pdf_image from "./single_image.png";
import User_info from "../../components/user_info.jsx";


function Option() {
  return (
    <>
      <div id="two_options">
        <User_info/>
        <div id="single_pdf">
          <h1 className="text" style={{position:"relative" , left : "13em", width :"5em"}}>Single PDF</h1>
          <h2 className="text" style={{position:"relative" , left : "16.5em", width :"8em",top : "2.5em"}}>Talk to Single PDF</h2>
          <img
            src={single_pdf_image}
            style={{
              height: "46vh",
              "border-radius": "12px",
              top: "8.7em",
              left: "2em",
              position: "relative",
              boxShadow: "0px 0px 10px #ff6500",
            }}
          />
          <button id="single_btn">Start Talking</button>
        </div>
        <div id="multiple_pdf">
          <h1 className="text">Mulitple PDF 👑</h1>
          <h2 className="text" style={{ position: "relative", top: "2em" }}>
            Talk to multiple PDFs at once
          </h2>
          <img
            src={multiple_pdf_image}
            style={{
              position: "relative",
              height: "48vh",
              "border-radius": "12px",
              top: "7em",
              boxShadow: "0px 0px 10px black",
            }}
          />
          <button id="multiple_btn">Start Talking</button>
        </div>
      </div>
    </>
  );
}

export default Option;
