import React, { createContext, useContext, useState } from "react";

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patient, setPatient] = useState(null);
  return (
    <PatientContext.Provider value={{ patient, setPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
