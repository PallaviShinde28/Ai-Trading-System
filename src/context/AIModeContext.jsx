import React, { createContext, useState, useContext } from "react";

const AIModeContext = createContext();

export const AIModeProvider = ({ children }) => {
  const [aiActive, setAiActive] = useState(false);

  const toggleAI = () => setAiActive((prev) => !prev);

  return (
    <AIModeContext.Provider value={{ aiActive, toggleAI }}>
      {children}
    </AIModeContext.Provider>
  );
};

export const useAIMode = () => useContext(AIModeContext);
