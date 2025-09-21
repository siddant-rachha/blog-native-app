import { Post, RoutesKey } from "@/types/commonTypes";
import React, { createContext, ReactNode, useState } from "react";

type GlobalState = {
  allPosts: Post[];
  myPosts: Post[];
  post: Post | null;
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
    type: "delete" | "edit";
  };
  postComingFrom: RoutesKey | null;
  searchResultsInfo: {
    headerEndPosition?: number;
    searchResults: Post[];
    MIN_SEARCH_LENGTH?: 3;
    isSearchFocus?: boolean;
    hide: boolean;
  };
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
      message: "",
      type: "delete",
    },
    postComingFrom: null,
    allPosts: [],
    myPosts: [],
    post: null,
    searchResultsInfo: {
      searchResults: [],
      MIN_SEARCH_LENGTH: 3,
      isSearchFocus: false,
      hide: false,
    },
  });

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
