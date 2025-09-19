import { Post, RoutesKey } from "@/types/commonTypes";
import React, { createContext, ReactNode, useState } from "react";

type GlobalState = {
  allPosts: Post[];
  myPosts: Post[];
  searchInput: string;
  isLoading: boolean;
  user: {
    email: string;
    displayName: string;
    photoURL: string;
  } | null;
  confirmationModal: {
    isOpen: boolean;
    callback: () => void;
    message: string;
  };
  postComingFrom: RoutesKey | null;
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
    user: null,
    confirmationModal: {
      isOpen: false,
      callback: () => {},
      message: "Do you want to delete?",
    },
    postComingFrom: null,
    allPosts: [],
    myPosts: [],
  });

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
