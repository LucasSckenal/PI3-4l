import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import FooterBar from '../components/FooterBar/FooterBar';
import { IoClose } from "react-icons/io5";
import { IoMicOff } from "react-icons/io5";
import { IoMic } from "react-icons/io5";
import { IoMoon } from "react-icons/io5";
import "./global.scss";
import MainPage from '../components/MainPage/MainPage';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeProvider/ThemeProvider';
import AppRoutes from '../routes/Routes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
