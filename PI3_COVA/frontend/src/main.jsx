import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import logo from '../public/Logo-4L.png';
import FooterBar from '../components/FooterBar/FooterBar';
import { IoClose } from "react-icons/io5";
import { IoMicOff } from "react-icons/io5";
import { IoMic } from "react-icons/io5";
import { IoMoon } from "react-icons/io5";
import "./global.scss";
import MainPage from '../pages/MainPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <img src={logo}/>
    <MainPage/>
  </StrictMode>
);
