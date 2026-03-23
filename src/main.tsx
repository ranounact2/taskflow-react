import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // Import manquant souvent oublié
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import App from './App'; // Import de ton composant App
import './index.css'; // Si tu as un fichier CSS global

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);