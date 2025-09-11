import { StyleSheet, Text, TextInput, View } from "react-native";

export default function HeaderWithSearch({ title }: { title: string }) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TextInput style={styles.searchInput} placeholder="Search..." />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    height: 36,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    minWidth: 200,
  },
});
