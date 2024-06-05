/* eslint-disable no-unused-vars */
// App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Landing from "./components/Landing/Landing";
import Login from "./components/Login/Login";
import Register from "./components/Register/User/Register";
import OwnerRegistration from "./components/Register/Owner/OwnerRegistration";
import PropertyList from './components/Property/PropertyList/PropertyList';
import PropertyDetail from './components/Property/PropertyDetail/PropertyDetail';
import RentManagement from './components/RentManagement/RentManagement';
import Transaction from './components/Transaction/TransactionManagement';
import PaymentHistory from './components/PaymentHistory/PaymentHistory';
import PropertyManagement from './components/Property/PropertyManagement/PropertyManagement';
import Inbox from './components/Inbox/Inbox/';
import { auth } from './config/firebase';
import PropTypes from 'prop-types';
import RegistrationContext from "./context/RegistrationContext";
import AdminLogin from './components/Admin/Login/AdminLogin';
import AdminUserManagement from './components/Admin/UserManagement/AdminUserManagement';

function NotFound() {
  return <div>Page Not Found</div>;
}

function App() {
  const [user, setUser] = useState(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [propertyId, setPropertyId] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsRegistered(user !== null);
    });
    return () => unsubscribe();
  }, []);

  // This is for general users
// eslint-disable-next-line no-unused-vars
const ProtectedRoute = ({ element, ...rest }) => {
  // Use rest somewhere in your component
  return user ? element : <Navigate to="/login" />;
};
ProtectedRoute.propTypes = {
  element: PropTypes.node.isRequired,
};

// This is for admin users
const AdminProtectedRoute = ({ element, ...rest }) => {
  // Use rest somewhere in your component
  return user ? element : <Navigate to="/admin" />;
};
AdminProtectedRoute.propTypes = {
  element: PropTypes.node.isRequired,
};

  return (
      <RegistrationContext.Provider value={{ showBackdrop, setShowBackdrop, applicationStatus, setApplicationStatus, isRegistered, setIsRegistered, propertyId, setPropertyId }}>
      <Router>
        <Routes>
          <Route exact path="/home" element={<Landing />} />
          <Route exact path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route exact path="/propertyList" element={<ProtectedRoute element={<PropertyList />} />} />
          <Route path="/propertyList/detail/:id" element={<ProtectedRoute element={<PropertyDetail />} />}/>
          <Route path="/transaction/detail/:id" element={<ProtectedRoute element={<PropertyDetail />} />}/>
          <Route path="/propertyManagement" element={<ProtectedRoute element={<PropertyManagement />}/>} key={isRegistered ? "loggedIn" : "loggedOut"} />          
          <Route path="/ownerRegistration" element={<ProtectedRoute element={<OwnerRegistration />} />}/>
          <Route path="/rentManagement" element={<ProtectedRoute element={<RentManagement />} />}/>
          <Route path="/transaction" element={<ProtectedRoute element={<Transaction />} />}/>
          <Route path="/paymentHistory" element={<ProtectedRoute element={<PaymentHistory />} />}/>
          <Route path="/inbox" element={<ProtectedRoute element={<Inbox />} />}/>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/adminUserManagement" element={<AdminProtectedRoute element={<AdminUserManagement />} />}/>
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Router>
      </RegistrationContext.Provider>
  );
}

export default App;