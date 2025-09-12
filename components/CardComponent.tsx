import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardProps {
  title: string;
  image: string;
  description: string;
  date: string;
}

export default function CardComponent({ item }: { item: CardProps }) {
  return (
    <View style={styles.card}>
      {/* title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* image */}
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.authorContainer}>
        {/* author round icon */}
        <Image source={{ uri: item.image }} style={styles.authorImage} />

        {/* author name and date container*/}
        <View>
          <Text style={styles.authorName}>Author Name</Text>
          <Text style={styles.authorDate}>Author Date</Text>
        </View>

        {/* Edit and Delete button  */}
        <View style={{ marginLeft: "auto", flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="edit" size={24} color={"#007BFF"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="delete-outline" size={24} color={"#FF3B30"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* description */}
      <Text>{item.description}</Text>

      {/* button */}
      <TouchableOpacity onPress={() => {}} style={styles.touchableButton}>
        <Text style={styles.touchableButtonText}>Read More</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    marginBottom: 8,
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: "gray",
  },
  touchableButton: {
    marginTop: 12,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  touchableButtonText: {
    color: "white",
  },

  // author styles
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  authorDate: {
    fontSize: 12,
    color: "gray",
  },
});
