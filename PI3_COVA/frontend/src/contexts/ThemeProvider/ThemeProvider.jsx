import { createContext, useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthProvider/AuthProvider";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const db = getFirestore();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "light" ? false : true;
  });

  const [preferredColor, setPreferredColor] = useState(() => {
    const storedColor = localStorage.getItem("preferredColor");
    return storedColor || "#7f41e2";
  });

  const [preferredLanguage, setPreferredLanguage] = useState(() => {
    const storedLang = localStorage.getItem("preferredLanguage");
    return storedLang || "pt";
  });

  const [loading, setLoading] = useState(true);
  const hasLoadedPreferences = useRef(false);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userPreferencesDoc = doc(
          db,
          "Users",
          user.uid,
          "preferences",
          "settings"
        );
        const docSnap = await getDoc(userPreferencesDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsDarkMode(data.darkMode ?? true);
          setPreferredColor(data.preferredColor ?? "#7f41e2");
          setPreferredLanguage(data.language ?? "pt");
        }
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
      } finally {
        hasLoadedPreferences.current = true;
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  useEffect(() => {
    if (loading) return;

    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    document.documentElement.style.setProperty(
      "--PreferredColor",
      preferredColor
    );

    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("preferredColor", preferredColor);
    localStorage.setItem("preferredLanguage", preferredLanguage);
  }, [isDarkMode, preferredColor, preferredLanguage, loading]);

  useEffect(() => {
    if (!user || !hasLoadedPreferences.current) return;

    const savePreferences = async () => {
      try {
        const userPreferencesRef = doc(
          db,
          "Users",
          user.uid,
          "preferences",
          "settings"
        );
        await setDoc(
          userPreferencesRef,
          {
            darkMode: isDarkMode,
            preferredColor,
            language: preferredLanguage,
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Erro ao salvar preferências:", error);
      }
    };

    savePreferences();
  }, [isDarkMode, preferredColor, preferredLanguage, user]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const handleColorChange = (color) => setPreferredColor(color);
  const handleLanguageChange = (lang) => setPreferredLanguage(lang);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        preferredColor,
        handleColorChange,
        preferredLanguage,
        handleLanguageChange,
      }}
    >
      {loading ? null : children}
    </ThemeContext.Provider>
  );
};
