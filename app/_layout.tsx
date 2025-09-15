import { ConfirmationModal } from "@/components/ConfirmationModal";
import DrawerWithListener from "@/components/DrawerWithListener";
import FirebaseGoogleAuthHandler from "@/components/FirebaseGoogleAuthHandler";
import { LoaderOverlay } from "@/components/LoadingOverlay";
import { GlobalStateProvider } from "@/store/context/Providers/GlobalStateContext";
import { secureTokenManager } from "@/utils/secure-token-manager/secureTokenManager";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function Layout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await secureTokenManager.loadFromStorageToMemory();
      setLoading(false);
    })();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <GlobalStateProvider>
      <ConfirmationModal />
      <FirebaseGoogleAuthHandler />
      <LoaderOverlay />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerWithListener />
      </GestureHandlerRootView>
      <Toast />
    </GlobalStateProvider>
  );
}
