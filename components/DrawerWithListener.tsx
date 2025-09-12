import { useGlobalState } from "@/globalState/useGlobalState";
import { useNavigationContainerRef } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useRef } from "react";
import HeaderWithSearch from "./HeaderWithSearch";

export default function DrawerWithListener() {
  const navigationRef = useNavigationContainerRef();
  const prevRouteNameRef = useRef<string | undefined>(undefined);

  const {
    actions: { setSearchInput },
  } = useGlobalState();

  useEffect(() => {
    const unsubscribe = navigationRef.addListener("state", () => {
      const currentRoute = navigationRef.getCurrentRoute();

      if (
        currentRoute?.name &&
        prevRouteNameRef.current !== currentRoute.name
      ) {
        // Screen actually changed
        setSearchInput("");
      }

      prevRouteNameRef.current = currentRoute?.name;
    });

    return unsubscribe;
  }, [navigationRef]);

  return (
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
  );
}
