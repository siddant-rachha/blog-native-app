import { useGlobalState } from "@/store/context/useGlobalState";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigationContainerRef } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useRef } from "react";
import { View } from "react-native";
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
      {[
        { name: "index", label: "Home", materialIcon: "home" as const },
        {
          name: "create-post",
          label: "Create Post",
          materialIcon: "post-add" as const,
        },
        { name: "my-posts", label: "My Posts", materialIcon: "book" as const },
      ].map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          options={({ navigation }) => ({
            drawerIcon: ({ color, size }) => (
              <MaterialIcons
                name={screen.materialIcon}
                size={size}
                color={color}
              />
            ),
            drawerLabel: screen.label,
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <HeaderWithSearch
                  title={screen.label}
                  materialIcon={screen.materialIcon}
                />
              </View>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                size={24}
                color="black"
                style={{ marginLeft: 12, marginRight: 6 }}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          })}
        />
      ))}
    </Drawer>
  );
}
