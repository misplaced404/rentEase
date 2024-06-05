import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import {LandingContainer} from "./Landing.styled.js"
import logo from "../../assets/Logo/RentEase Logo2.png"

function Landing() {

  return (
    <>
      <Header/>
      <LandingContainer>
        <div className="header" id="home">
          <div className="layer">
            <h1>We Help You Find Home</h1>
            <h2>Find The Perfect House To Live In Now</h2>
          </div>
        </div>
        <div className="aboutUs" id="aboutUs">
          <div className="layer">
            <div className="logoArea">
              <img src={logo} alt="" /><span>RentEase</span>
            </div>
            <div>
              <h2>Vision</h2>
              <p>&emsp;To provide a seamless, efficient, and easy access rental experience by leveraging innovative technology and exceptional customer service. 
                Our goal is to connect renters with budget-friendly rental properties while ensuring transparency, reliability, and convenience at every step of the rental process.
              </p> 
            </div>
            <div>
              <h2>Mission</h2>
              <p>&emsp;To be the leading platform for rental solutions, revolutionizing the rental industry through cutting-edge technology, 
                unmatched customer support, and a commitment to excellence. We envision a future where finding and managing rental properties is a hassle-free, 
                enjoyable experience for all.
              </p> 
            </div>
          </div>
        </div>
         
        
      </LandingContainer>
         
      <Footer/>
    </>
  )
}

export default Landing;
