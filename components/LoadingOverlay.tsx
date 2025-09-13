import { useGlobalState } from "@/store/context/useGlobalState";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

export const LoaderOverlay = () => {
  const {
    selectors: { isLoading },
  } = useGlobalState();

  return (
    <Modal transparent animationType="fade" visible={isLoading}>
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
  },
});
