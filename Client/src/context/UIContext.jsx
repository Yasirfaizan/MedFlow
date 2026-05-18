import { createContext, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const value = useMemo(
    () => ({
      sidebarOpen,
      openSidebar: () => setSidebarOpen(true),
      closeSidebar: () => setSidebarOpen(false),
      toggleSidebar: () => setSidebarOpen((prev) => !prev),
    }),
    [sidebarOpen],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => useContext(UIContext);
