import React, { createContext, ReactNode, useState } from "react";

type GlobalState = {
  searchInput: string;
  isLoading: boolean;
};

type GlobalStateContextType = {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
};

export const GlobalStateContext = createContext<
  GlobalStateContextType | undefined
>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GlobalState>({
    searchInput: "",
    isLoading: true,
  });

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
