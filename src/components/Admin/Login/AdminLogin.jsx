import { useState } from 'react';
import { AdminLoginContainer } from './AdminLogin.style';
import logo from '../../../assets/Logo/RentEase Logo2.png';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Signed in 
            const user = userCredential.user;
            console.log('Login successful');
            navigate('/adminUserManagement');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error signing in', errorCode, errorMessage);
        }
    };

    return (
        <AdminLoginContainer>
          <div className='side'>
            <div className="imagecontainer">
              <img src={logo} alt="" />
            </div>
            <div className='content'>
              <h1>RentEase</h1>
              <p>Administration Login</p>
            </div>
          </div>
          <div className='loginContainer'>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className='inputField'>
                <input 
                  type="email" 
                  name="email" 
                  className="email" 
                  placeholder='Email' 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                  type="password" 
                  name="password" 
                  className="password" 
                  placeholder='Password' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </AdminLoginContainer>
    );
}
