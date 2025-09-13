import DrawerWithListener from "@/components/DrawerWithListener";
import { LoaderOverlay } from "@/components/LoadingOverlay";
import { GlobalStateProvider } from "@/store/context/Providers/GlobalStateContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GlobalStateProvider>
      <LoaderOverlay />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerWithListener />
      </GestureHandlerRootView>
    </GlobalStateProvider>
  );
}
