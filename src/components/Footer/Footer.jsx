import styled from "./Footer.module.css"

function Footer() {
  
  return (
    <div className={`${styled.footer}`}>
        <span>Terms</span>
        <span>Policy</span>
        <span>&copy; {new Date().getFullYear()} RentEase</span>
    </div>
  )
}

export default Footer