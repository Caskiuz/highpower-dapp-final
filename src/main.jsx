import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 
import { WagmiProviderWrapper } from './wagmi.jsx'; // Importamos desde el archivo wagmi.jsx

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProviderWrapper>
      <App />
    </WagmiProviderWrapper>
  </React.StrictMode>,
);
