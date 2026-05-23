// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'

import App from './Landing';           // Your landing page

import SignupPage from './SignupPage'; // Your signup page
import LoginPage from './LoginPage';   // Your login page (if you create it)
// import SignupPage from './SignupPage'; // if you create it

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);