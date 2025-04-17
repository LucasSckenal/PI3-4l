import { Routes, Route } from "react-router-dom";
import MainPage from "../components/MainPage/MainPage"; // <- ou ajuste o caminho
import HomePage from "../pages/Home/HomePage";
import ChatPage from "../pages/Chat/ChatPage";
import HistoryPage from "../pages/History/HistoryPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SettingsPage from "../pages/Settings/SettingsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}>
        <Route index element={<HomePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
