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
import InnerAnalysisPage from "../pages/InnerAnalysis/InnerAnalysisPage.jsx";
import DoctorProfilePage from "../pages/DoctorProfile/DoctorProfilePage.jsx";
import DoctorHomePage from "../pages/DoctorHome/DoctorHomePage.jsx"

import RoleRoute from "./roleRoutes";
import PrivateRoute from "./PrivateRoutes";
import AnalysisResultPage from "../pages/AnalysisResult/AnalysisResultPage.jsx";

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

      {/* InnerChatPage com layout separado */}
      <Route
        path="/chat/:chatId"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["user"]}>
              <InnerChatPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Layout compartilhado com MainPage */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      >
      <Route
        path="analysisresults/:chatId"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["user"]}>
              <AnalysisResultPage />
            </RoleRoute>
          </PrivateRoute>
        }
      />
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
        <Route
          path="doctor/home"
          element={
            <RoleRoute allowedRoles={["doctor"]}>
              <DoctorHomePage />
            </RoleRoute>
          }
        />
        <Route
          path="analysis"
          element={
            <RoleRoute allowedRoles={["doctor"]}>
              <AnalysisPage />
            </RoleRoute>
          }
        />
        <Route
          path="/analysis/:analysisId"
        element={
          <RoleRoute allowedRoles={["doctor"]}>
            <InnerAnalysisPage />
          </RoleRoute>
        }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <DoctorProfilePage />
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
