// src/context/ClubContext.jsx
import { createContext, useContext } from 'react';
const ClubContext = createContext();

export const ClubProvider = ({ children }) => {
  const clubs = [
    
  ];

  return (
    <ClubContext.Provider value={{ clubs }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClubs = () => useContext(ClubContext);