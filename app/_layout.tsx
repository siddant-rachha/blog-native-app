import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HeaderWithSearch from "../components/HeaderWithSearch";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Home",
            title: "Home",
            headerTitle: () => <HeaderWithSearch title="Home" />,
          }}
        />

        <Drawer.Screen
          name="create-post"
          options={{
            drawerLabel: "Create Post",
            title: "Create Post",
            headerTitle: () => <HeaderWithSearch title="Create Post" />,
          }}
        />

        <Drawer.Screen
          name="my-posts"
          options={{
            drawerLabel: "My Posts",
            title: "My Posts",
            headerTitle: () => <HeaderWithSearch title="My Posts" />,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
