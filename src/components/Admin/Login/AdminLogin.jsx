import { useState } from 'react';
import { AdminLoginContainer } from './AdminLogin.style';
import logo from '../../../assets/Logo/RentEase Logo2.png';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleLogin = async () => {
        const db = getFirestore();
        const q = query(collection(db, 'admin'), where('username', '==', userName), where('password', '==', password));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          console.log('Login successful');
          navigate('/adminUserManagement');
        } else {
          console.error('Error signing in');
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
                  type="text" 
                  name="userName" 
                  className="userName" 
                  placeholder='User name' 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
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