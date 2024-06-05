import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {RegisterContainer} from "./Register.styled.js";
import Header from "../../../components/Header/Header";
import Logo from "../../../assets/Logo/RentEase Logo2.png";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'; // Import functions from firebase/auth
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import functions from firebase/firestore
import { app } from '../../../config/firebase'; // Import app from firebase

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNum, setcontactNum] = useState('');
  const [CurrentAddress, setCurrentAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword || !CurrentAddress) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Send verification email
      await sendEmailVerification(userCredential.user);
      console.log('Verification email sent');

      // Store user data in Firestore
      const userData = {
        firstName,
        lastName,
        email,
        contactNum,
        CurrentAddress,
        userType: 'Renter',
      };
      const firestore = getFirestore();
      await setDoc(doc(firestore, 'users', userCredential.user.uid), userData);

      setSuccessMessage('User registered successfully');
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setCurrentAddress('');
    }
  }

  const handleCancel = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    navigate('/login'); // Navigate to login page when cancel button is clicked
  }

  return (
    <>  
      <Header />
      <RegisterContainer>
        <div className="content">
          <img src={Logo} alt="RentEase Logo" />
          <form onSubmit={handleSubmit} className="signUpForm">
            <h2>Sign Up</h2>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Contact Number" value={contactNum} onChange={(e) => setcontactNum(e.target.value)} />
            <input type="text" placeholder="Current Address: Street, Brgy, City" value={CurrentAddress} onChange={(e) => setCurrentAddress(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <div className="formBtn">
              <button type="button" className="cancelBtn" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="submitBtn">Register</button>
            </div>
          </form>
          {error && <div className="error">{error}</div>}
          {successMessage && <div className="success">{successMessage}</div>}
        </div>
      </RegisterContainer>
    </>
  );
}

export default Register;
