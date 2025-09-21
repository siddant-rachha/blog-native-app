import { Post, RoutesKey } from "@/types/commonTypes";
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
  const postComingFrom = state.postComingFrom;
  const allPosts = state.allPosts;
  const myPosts = state.myPosts;
  const post = state.post;
  const searchResultsInfo = state.searchResultsInfo;

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

  const setPostComingFrom = (value: RoutesKey | null) => {
    setState((prev) => ({
      ...prev,
      postComingFrom: value,
    }));
  };

  const setModalConfirmation = (
    isOpen: boolean,
    callback: () => void,
    type: "delete" | "edit" = "delete"
  ) => {
    const message =
      type === "delete" ? "Do you want to delete?" : "Do you want to edit?";
    setState((prev) => ({
      ...prev,
      confirmationModal: {
        ...prev.confirmationModal,
        isOpen,
        callback,
        type,
        ...(message ? { message } : {}),
      },
    }));
  };

  const setAllPosts = (posts: Post[]) => {
    setState((prev) => ({
      ...prev,
      allPosts: posts,
    }));
  };

  const setMyPosts = (posts: Post[]) => {
    setState((prev) => ({
      ...prev,
      myPosts: posts,
    }));
  };

  const setPost = (postData: Post | null) => {
    setState((prev) => ({
      ...prev,
      post: postData,
    }));
  };

  const setSearchResultsInfo = (info: Partial<typeof searchResultsInfo>) => {
    setState((prev) => ({
      ...prev,
      searchResultsInfo: {
        ...prev.searchResultsInfo,
        ...info,
      },
    }));
  };

  return {
    selectors: {
      searchInput,
      isLoading,
      user,
      modalConfirmation,
      postComingFrom,
      allPosts,
      myPosts,
      post,
      searchResultsInfo,
    },
    actions: {
      setSearchInput,
      setIsLoading,
      setUser,
      setModalConfirmation,
      setPostComingFrom,
      setAllPosts,
      setMyPosts,
      setPost,
      searchResultsInfo,
      setSearchResultsInfo,
    },
  };
};
