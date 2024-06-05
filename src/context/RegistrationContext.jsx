// In RegistrationContext.js
import { createContext } from 'react';

const RegistrationContext = createContext({
  showBackdrop: false,
  setShowBackdrop: () => {},
  applicationStatus: null,
  setApplicationStatus: () => {},
  isRegistered: false,
  setIsRegistered: () => {},
  propertyId: null, // Add this line
  setPropertyId: () => {}, // Add this line
});

export default RegistrationContext;
