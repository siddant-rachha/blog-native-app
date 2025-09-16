import { useContext } from "react";
import { GlobalStateContext } from "./Providers/GlobalStateContext";

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error(
      "useGlobalState must be used within an GlobalStateProvider"
    );
  }

  const { state, setState } = context;

  // Selectors
  const searchInput = state.searchInput;
  const isLoading = state.isLoading;
  const user = state.user;
  const modalConfirmation = state.confirmationModal;

  // Actions
  const setSearchInput = (value: string) => {
    setState((prev) => ({
      ...prev,
      searchInput: value,
    }));
  };

  const setIsLoading = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading: value,
    }));
  };

  const setUser = (value: any) => {
    setState((prev) => ({
      ...prev,
      user: value,
    }));
  };

  const setModalConfirmation = (
    isOpen: boolean,
    callback: () => void,
    message?: string
  ) => {
    setState((prev) => ({
      ...prev,
      confirmationModal: {
        ...prev.confirmationModal,
        isOpen,
        callback,
        ...(message ? { message } : {}),
      },
    }));
  };

  return {
    selectors: { searchInput, isLoading, user, modalConfirmation },
    actions: { setSearchInput, setIsLoading, setUser, setModalConfirmation },
  };
};
