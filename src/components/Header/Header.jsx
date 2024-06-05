import { Link as ScrollLink } from 'react-scroll'; // Import Link from react-scroll
import { Link as RouterLink } from 'react-router-dom'; // Import Link from react-router-dom
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate from react-router-dom
import { NavBarContainer } from './Header.styled.js';
import { scroller } from 'react-scroll'; // Import scroller from react-scroll

function Header() {
  const location = useLocation(); // Get current URL path
  const navigate = useNavigate(); // Get access to the navigate function
  const pdfPath = 'https://firebasestorage.googleapis.com/v0/b/rentease-73c75.appspot.com/o/ra-9653.pdf?alt=media&token=5178d54c-9c9a-4b75-93dc-99e37446709b';

  const navigateAndScroll = (path, target) => {
    // Navigate to the landing page
    navigate(path);

    // Scroll to the target section
    setTimeout(() => {
      scroller.scrollTo(target, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      })
    }, 100);
  }

  return (
    <>
      <NavBarContainer>
        <div className="header">
          <div className="navbar">
            <div className="text-2xl font-extrabold ">
              <RouterLink className="logo" to="/"><img className="logoImage" src='./src/assets/Logo/RentEase Logo2_inv.png'></img>RentEase</RouterLink>
            </div>
            <ul className="links">
              <li onClick={() => navigateAndScroll('/', 'home')}>Home</li>
              {/* <li><RouterLink to="/services">Services</RouterLink></li> */}
              <li onClick={() => navigateAndScroll('/', 'aboutUs')}>About Us</li>
              <a href={pdfPath} target="_blank" rel="noopener noreferrer"><li>Know Your Rights (R.A. 9653)</li></a>
            </ul>
            {location.pathname !== '/login' && <RouterLink to="/login" className="getStarted_Btn">Login</RouterLink>}
            <button className="toggle_btn" onClick={(toggle_btn) => toggle_btn.classList.toggle('active')}><i className='bx bx-menu'></i></button>
          </div>
          <div className="dropdown_menu open">
            <li><RouterLink to="/home">Home</RouterLink></li>
            <li><RouterLink to="/aboutUs">About Us</RouterLink></li>
            <li><RouterLink to="/contact">Contact</RouterLink></li>
            <li><RouterLink to="/login" className="getStarted_btn">Get Started</RouterLink></li>
          </div>
        </div>
      </NavBarContainer>
    </>
  )
}

export default Header;
