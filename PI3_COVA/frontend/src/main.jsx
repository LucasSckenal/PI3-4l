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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AccountProvider>
          <BrowserRouter>
            <IaProvider>
              <AppRoutes/>
            </IaProvider>
          </BrowserRouter>
        </AccountProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
