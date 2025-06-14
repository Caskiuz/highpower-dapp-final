import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // <<-- ¡¡ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ PRESENTE Y CORRECTA!!
import { WagmiProviderWrapper } from './wagmi.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProviderWrapper>
      <App />
    </WagmiProviderWrapper>
  </React.StrictMode>,
);
