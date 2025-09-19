import { Routes, RoutesKey } from "@/types/commonTypes";
import { useNavigationContainerRef } from "expo-router";

export function useGetScreen() {
  // all routes should be defined in Routes object in commonTypes.ts to avoid undefined currentScreen
  const navigationRef = useNavigationContainerRef();
  const currentScreen =
    Routes[navigationRef.getCurrentRoute()?.name as RoutesKey];

  return { currentScreen };
}
