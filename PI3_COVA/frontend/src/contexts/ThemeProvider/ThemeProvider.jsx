import { createContext, useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthProvider/AuthProvider";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const db = getFirestore();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Inicializa com localStorage se disponível, senão, assume dark mode como padrão
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "light" ? false : true;
  });

  const [preferredColor, setPreferredColor] = useState(() => {
    // Inicializa com localStorage se disponível, senão, assume a cor padrão
    const storedColor = localStorage.getItem("preferredColor");
    return storedColor || "#7f41e2";
  });

  const [loading, setLoading] = useState(true);

  const hasLoadedPreferences = useRef(false);

  // Carregar preferências do Firestore
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

  // Aplicar estilo ao DOM e sincronizar com localStorage
  useEffect(() => {
    if (loading) return;

    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    document.documentElement.style.setProperty(
      "--PreferredColor",
      preferredColor
    );

    // LocalStorage apenas para fallback local
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("preferredColor", preferredColor);
  }, [isDarkMode, preferredColor, loading]);

  // Salvar preferências no Firestore
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
        await setDoc(userPreferencesRef, {
          darkMode: isDarkMode,
          preferredColor: preferredColor,
        });
      } catch (error) {
        console.error("Erro ao salvar preferências:", error);
      }
    };

    savePreferences();
  }, [isDarkMode, preferredColor, user]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const handleColorChange = (color) => setPreferredColor(color);

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleTheme, preferredColor, handleColorChange }}
    >
      {loading ? null : children}
    </ThemeContext.Provider>
  );
};
