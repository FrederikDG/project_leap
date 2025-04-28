import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CompanyProvider } from './context/CompanyContext.jsx';
import './reset.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <CompanyProvider>
        <App />
      </CompanyProvider>
    </BrowserRouter>
  </AuthProvider>
);
