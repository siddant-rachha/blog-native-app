import { StyleSheet, Text, View } from "react-native";

export default function CardComponent() {
  return (
    <View style={styles.card}>
      <Text>Title</Text>
      <Text>Image</Text>
      <Text>Description</Text>
      <Text>Date</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16,
  },
});
