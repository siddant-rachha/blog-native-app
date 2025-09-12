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

  // Actions
  const setSearchInput = (value: string) => {
    setState((prev) => ({
      ...prev,
      searchInput: value,
    }));
  };

  return {
    selectors: { searchInput },
    actions: { setSearchInput },
  };
};
