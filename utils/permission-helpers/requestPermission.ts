import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

export const requestCameraPermission = async () => {
  const { status, canAskAgain } =
    await ImagePicker.requestCameraPermissionsAsync();

  if (status === "granted") return true;

  if (!canAskAgain) {
    Alert.alert(
      "Permission Required",
      "Camera access was denied. Please enable it in settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
  }
  return false;
};

export const requestGalleryPermission = async () => {
  const { status, canAskAgain } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status === "granted") return true;

  if (!canAskAgain) {
    Alert.alert(
      "Permission Required",
      "Photo library access was denied. Please enable it in settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
  }
  return false;
};
