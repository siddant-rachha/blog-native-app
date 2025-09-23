import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type DropdownItem = {
  label: string;
  value: string | number;
};

type Props = {
  items: DropdownItem[];
  value: string | number | null;
  onValueChange: (value: string | number | any) => void;
  style?: StyleProp<ViewStyle>;
};

const Dropdown = ({ items, value, onValueChange, style }: Props) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel = items.find((item) => item.value === value)?.label;

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setVisible(true)}
      >
        <View style={styles.row}>
          <Text style={styles.label}>{selectedLabel}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color="#888"
            style={styles.icon}
          />
        </View>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.listContainer}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  icon: {
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  listContainer: {
    marginHorizontal: 32,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default Dropdown;
