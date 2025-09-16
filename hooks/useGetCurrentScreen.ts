import { Routes, RoutesKey } from "@/types/commonTypes";
import { useNavigationContainerRef } from "expo-router";

export function useGetCurrentScreen() {
  const navigationRef = useNavigationContainerRef();
  const currentScreen =
    Routes[navigationRef.getCurrentRoute()?.name as RoutesKey];

  return { currentScreen };
}
