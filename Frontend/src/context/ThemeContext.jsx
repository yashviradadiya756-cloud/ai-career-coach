import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    // Apply dark mode to entire app body — all pages get it
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.style.background = "#111827";
      document.body.style.color = "#ffffff";
    } else {
      document.body.classList.remove("dark-mode");
      document.body.style.background = "";
      document.body.style.color = "";
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}