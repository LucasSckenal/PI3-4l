// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeContext } from "../contexts/ThemeProvider/ThemeProvider";

import MainPage from "../components/MainPage/MainPage";
import HomePage from "../pages/Home/HomePage";
import ChatPage from "../pages/Chat/ChatPage";               // página de início de chat (nova conversa)
import InnerChatPage from "../pages/InnerChat/InnerChatPage"; // página de visualização de conversa existente
import HistoryPage from "../pages/History/HistoryPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SettingsPage from "../pages/Settings/SettingsPage";
import PrivateRoute from "./PrivateRoutes";
import LoginPage from "../pages/Auth/Login/LoginPage";
import RegisterPage from "../pages/Auth/Register/RegisterPage";

const AppRoutes = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />

      <Routes>
        {/* Rota pública */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
         <Route
            path="chat/:chatId"
            element={
              <PrivateRoute>
                <InnerChatPage />
              </PrivateRoute>
            }
          />
        {/* Rotas privadas a partir de / */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />

          {/* Iniciar nova conversa */}
          <Route
            path="chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />

          {/* Visualizar conversa existente */}
         

          <Route
            path="history"
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
