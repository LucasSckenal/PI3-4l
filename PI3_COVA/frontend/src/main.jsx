import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import FooterBar from './components/FooterBar/FooterBar';
import { IoMicOff } from "react-icons/io5";
import { IoMoon } from "react-icons/io5";
import "./global.scss";
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider/ThemeProvider';
import AppRoutes from './routes/Routes';
import { AuthProvider } from "./contexts/AuthProvider/AuthProvider";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes/>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
