// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// import "@fontsource/outfit"
// import "@fontsource/roboto"

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import "@fontsource/outfit";
import "@fontsource/roboto";

import { PatientProvider } from './context/PatientContext'; // 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PatientProvider>
      <App />
    </PatientProvider>
  </StrictMode>
);
