/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useMemo, useRef } from "react";


export const SelectedOptionsContext = React.createContext();

export const SelectedOptionsProvider = ({ children }) => {
  

  const [userData, setUserData] = useState("hola");
 
  return (
    <SelectedOptionsContext.Provider
      value={{
       
        userData,
        
      }}
    >
      {children}
    </SelectedOptionsContext.Provider>
  );
};

export default SelectedOptionsProvider;
