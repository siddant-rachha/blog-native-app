import { useGlobalState } from "@/globalState/useGlobalState";
import { MaterialIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Infer the `name` prop type from MaterialIcons
type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export default function HeaderWithSearch({
  title,
  materialIcon,
}: {
  title: string;
  materialIcon: MaterialIconName;
}) {
  const {
    selectors: { searchInput },
    actions: { setSearchInput },
  } = useGlobalState();
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <MaterialIcons
        name={materialIcon}
        size={24}
        color="black"
        style={{ marginRight: 12 }}
      />
      <TextInput
        value={searchInput}
        onChangeText={setSearchInput}
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor={"#888"}
      />
      <TouchableOpacity
        style={styles.touchableOpacityButton}
        onPress={() => {}}
      >
        <Text style={{ color: "white" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 36,
    position: "relative",
  },
  headerTitle: {
    fontSize: 16,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 12,
    color: "black",
  },
  touchableOpacityButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: "#007aff",
    borderColor: "#007aff",
  },
});
