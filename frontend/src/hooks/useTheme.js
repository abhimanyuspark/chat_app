import { create } from "zustand";

const useTheme = create((set) => ({
  theme: localStorage.getItem("theme") || "light", // Default theme
  setTheme: (t) => {
    localStorage.setItem("theme", t);
    set({ theme: t });
  },
}));

export default useTheme;
