import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n/i18n.js';
import { BrowserRouter } from "react-router-dom";
import { GoogleMapsProvider } from './utils/map/GoogleMapsProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleMapsProvider>
      <App />
    </GoogleMapsProvider>
   
    </BrowserRouter>
    
  </StrictMode>,
)
