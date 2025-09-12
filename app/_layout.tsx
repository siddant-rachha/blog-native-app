import DrawerWithListener from "@/components/DrawerWithListener";
import { GlobalStateProvider } from "@/globalState/Providers/GlobalStateContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GlobalStateProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerWithListener />
      </GestureHandlerRootView>
    </GlobalStateProvider>
  );
}
