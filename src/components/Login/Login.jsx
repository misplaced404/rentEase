import { useState, useContext, useEffect } from 'react'; // Add useEffect
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LoginContainer } from "./Login.styled.js";
import Header from "../Header/Header";
import Logo from "../../assets/Logo/RentEase Logo2.png";
import { app } from '../../config/firebase';
import RegistrationContext from '../../context/RegistrationContext'; // Import RegistrationContext
import { doc, getDoc, getFirestore } from 'firebase/firestore'; // Add this line



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const auth = getAuth(app);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { setIsRegistered, setApplicationStatus, setShowBackdrop } = useContext(RegistrationContext);

  useEffect(() => {
    if (auth.currentUser) {
      const fetchStatus = async () => {
        const docRef = doc(getFirestore(), 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setApplicationStatus(docSnap.data().registrationStatus);
        }
      };
      fetchStatus();
    }
  }, [auth.currentUser, setApplicationStatus]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Check if email is verified
      if (!user.emailVerified) {
        setError('Please verify your email address');
        return;
      }
  
      console.log('Login successful');
      
      // Fetch the user's registration status from the database
      const docRef = doc(getFirestore(), 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const registrationStatus = docSnap.data().registrationStatus;
        setApplicationStatus(registrationStatus);
        // If the registrationStatus is 'review' or 'reject', show the backdrop
        if (registrationStatus === 'review' || registrationStatus === 'reject') {
          setShowBackdrop(true);
        }
        else if (registrationStatus === 'confirm') {
          setIsRegistered(true); 
        }
      }
  
      navigate('/propertyList');
    } catch (error) {
      console.error('Login failed', error);
      switch (error.code) {
        case 'auth/invalid-email':
        case 'auth/user-disabled':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid credentials');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    }
  }
  
  
  return (
    <>  
      <Header />
      <LoginContainer>
        <div className="content">
          <img src={Logo} alt="RentEase Logo" />
          <div className="loginFormContainer"> 
            <form onSubmit={handleSubmit} className="loginForm">
              <h2>Login</h2>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className="submitBtn">Login</button>
              <a href="#" className="">Forgot Password?</a>
            </form>
            <div className="signup">
              <p>Dont have an account? <a href="register"> Sign up</a></p>
            </div>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      </LoginContainer>
     
    </>
  );
}

export default Login;
