import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FooterBar from "./components/FooterBar/FooterBar";
import { IoMicOff } from "react-icons/io5";
import { IoMoon } from "react-icons/io5";
import "./global.scss";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider/ThemeProvider";
import AppRoutes from "./routes/Routes";
import { AuthProvider } from "./contexts/AuthProvider/AuthProvider";
import AccountProvider from "./contexts/Account/AccountProvider";
import { IaProvider } from "./contexts/IaProvider/IaProvider";
import { NotificationProvider } from "./contexts/NotifyProvider/NotifyProvider";
import ScreenResizeProvider from "./contexts/ScreenResizeProvider/ScreenResizeProvider";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AccountProvider>
        <ThemeProvider>
         
            <ScreenResizeProvider>
              <BrowserRouter>
                <NotificationProvider>
                <IaProvider>
                  <AppRoutes />
                </IaProvider>
                </NotificationProvider>
              </BrowserRouter>
            </ScreenResizeProvider>
          
        </ThemeProvider>
      </AccountProvider>
    </AuthProvider>
  </StrictMode>
);
