import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HeaderWithSearch from "../components/HeaderWithSearch";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            headerTitle: () => <HeaderWithSearch title="Home" />,
          }}
        />

        <Drawer.Screen
          name="create-post"
          options={{
            drawerLabel: "Create Post",
            headerTitle: () => <HeaderWithSearch title="Create Post" />,
          }}
        />

        <Drawer.Screen
          name="my-posts"
          options={{
            drawerLabel: "My Posts",
            headerTitle: () => <HeaderWithSearch title="My Posts" />,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
