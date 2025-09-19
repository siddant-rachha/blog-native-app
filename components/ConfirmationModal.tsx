import { useGlobalState } from "@/store/context/useGlobalState";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
export const ConfirmationModal = () => {
  const {
    actions: { setModalConfirmation },
    selectors: { modalConfirmation },
  } = useGlobalState();

  if (!modalConfirmation.isOpen) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalConfirmation(false, () => {})}
        style={styles.modalOverlay}
      />
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{modalConfirmation.message}</Text>
        <View style={{ flexDirection: "row", gap: 24 }}>
          <TouchableOpacity
            onPress={() => {
              modalConfirmation.callback();
              setModalConfirmation(false, () => {});
            }}
            style={{
              ...styles.modalYesButton,
              backgroundColor:
                modalConfirmation.type === "edit" ? "#007BFF" : "#FF5B5B",
            }}
          >
            <Text style={{ color: "white" }}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalConfirmation(false, () => {})}
            style={styles.modalNoButton}
          >
            <Text>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 900,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: screenHeight,
    width: screenWidth,
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: screenHeight,
    width: screenWidth,
    position: "absolute",
    zIndex: 901,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.8,
    zIndex: 902,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "light",
    marginBottom: 10,
  },
  modalYesButton: {
    padding: 10,
    borderRadius: 5,
    width: 50,
    alignItems: "center",
  },
  modalNoButton: {
    backgroundColor: "#D3D3D3",
    padding: 10,
    borderRadius: 5,
    width: 50,
    alignItems: "center",
  },
});
