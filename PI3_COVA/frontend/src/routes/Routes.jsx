import { Routes, Route } from "react-router-dom";
import MainPage from "../components/MainPage/MainPage"; // <- ou ajuste o caminho
import HomePage from "../pages/Home/HomePage";
import ChatPage from "../pages/Chat/ChatPage";
import HistoryPage from "../pages/History/HistoryPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SettingsPage from "../pages/Settings/SettingsPage";
import PrivateRoute from "./PrivateRoutes";
import LoginPage from "../pages/Login/LoginPage";

const AppRoutes = () => {
  return (
    
    <Routes>
      <Route path="login" element={<LoginPage />} />

      <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>}>
        <Route index element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
