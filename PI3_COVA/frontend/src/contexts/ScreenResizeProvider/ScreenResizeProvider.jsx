import { createContext, useContext, useEffect, useState } from "react";

const ScreenResizeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useScreenResize = () => useContext(ScreenResizeContext);

function ScreenResizeProvider({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ScreenResizeContext.Provider value={{ isMobile }}>
      {children}
    </ScreenResizeContext.Provider>
  );
}

export default ScreenResizeProvider;
