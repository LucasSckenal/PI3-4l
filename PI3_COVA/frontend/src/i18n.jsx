import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationPT from "./locales/pt/translation.json";
import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";

const resources = {
  pt: { translation: translationPT },
  en: { translation: translationEN },
  es: { translation: translationES },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("preferredLanguage") || "pt",
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
