import CardComponent from "@/components/CardComponent";
import { FlatList, StyleSheet } from "react-native";
import sampleData from "../assets/data/sampleData.json";

export default function Home() {
  return (
    <FlatList
      style={styles.container}
      data={sampleData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <CardComponent item={item} />}
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
