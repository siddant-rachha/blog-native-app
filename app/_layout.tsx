import { ConfirmationModal } from "@/components/ConfirmationModal";
import DrawerWithListener from "@/components/DrawerWithListener";
import FirebaseGoogleAuthHandler from "@/components/FirebaseGoogleAuthHandler";
import { LoaderOverlay } from "@/components/LoadingOverlay";
import SearchResults from "@/components/SearchResults";
import { GlobalStateProvider } from "@/store/context/Providers/GlobalStateContext";
import { secureTokenManager } from "@/utils/secure-token-manager/secureTokenManager";
import { useLayoutEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function Layout() {
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    (async () => {
      await secureTokenManager.loadFromStorageToMemory();
      setIsReady(true);
    })();
  }, []);

  if (isReady === false)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <GlobalStateProvider>
      <ConfirmationModal />
      <FirebaseGoogleAuthHandler />
      <LoaderOverlay />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerWithListener />
        <SearchResults />
      </GestureHandlerRootView>
      <Toast />
    </GlobalStateProvider>
  );
}
