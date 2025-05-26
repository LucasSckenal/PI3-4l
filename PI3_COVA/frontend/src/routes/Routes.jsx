import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeContext } from "../contexts/ThemeProvider/ThemeProvider";

import MainPage from "../components/MainPage/MainPage";
import HomePage from "../pages/Home/HomePage";
import ChatPage from "../pages/Chat/ChatPage";
import InnerChatPage from "../pages/InnerChat/InnerChatPage";
import HistoryPage from "../pages/History/HistoryPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SettingsPage from "../pages/Settings/SettingsPage";
import LoginPage from "../pages/Auth/Login/LoginPage";
import RegisterPage from "../pages/Auth/Register/RegisterPage";

import AnalysisPage from "../pages/Analysis/AnalysisPage.jsx";
import DoctorProfilePage from "../pages/DoctorProfile/DoctorProfilePage.jsx";

import RoleRoute from "./roleRoutes";
import PrivateRoute from "./PrivateRoutes";

const AppRoutes = () => {
  const { isDarkMode } = useContext(ThemeContext);

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
        theme={isDarkMode ? "dark" : "light"}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        >
          {/* Rotas para usuários normais */}
          <Route
            index
            element={
              <RoleRoute allowedRoles={["user"]}>
                <HomePage />
              </RoleRoute>
            }
          />

          <Route
            path="chat"
            element={
              <RoleRoute allowedRoles={["user"]}>
                <ChatPage />
              </RoleRoute>
            }
          />
          <Route
            path="chat/:chatId"
            element={
              <RoleRoute allowedRoles={["user"]}>
                <InnerChatPage />
              </RoleRoute>
            }
          />

          <Route
            path="history"
            element={
              <RoleRoute allowedRoles={["user"]}>
                <HistoryPage />
              </RoleRoute>
            }
          />

          <Route
            path="profile"
            element={
              <RoleRoute allowedRoles={["user"]}>
                <ProfilePage />
              </RoleRoute>
            }
          />

          {/* Rotas para médicos */}
          <Route
            path="analysis"
            element={
              <RoleRoute allowedRoles={["doctor"]}>
                <AnalysisPage />
              </RoleRoute>
            }
          />

          <Route
            path="doctor/profile"
            element={
              <RoleRoute allowedRoles={["doctor"]}>
                <DoctorProfilePage />
              </RoleRoute>
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
