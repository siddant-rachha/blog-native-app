import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function HeaderWithSearch({ title }: { title: string }) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TextInput style={styles.searchInput} placeholder="Search..." />
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
    paddingHorizontal: 12,
    minHeight: 36,
    width: screenWidth - screenWidth * 0.2, // 80% of screen width
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    marginRight: 12,
    maxWidth: 120,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 12,
    color: "black"
  },
  touchableOpacityButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: "#007aff",
  },
});
