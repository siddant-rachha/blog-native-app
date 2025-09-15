import { useGlobalState } from "@/store/context/useGlobalState";
import { signInWithGoogle } from "@/utils/google-auth/signInWithGoogle";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth, signOut } from "@react-native-firebase/auth";
import { ComponentProps, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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
    selectors: { searchInput, user },
    actions: { setSearchInput },
  } = useGlobalState();
  const [showUserInfo, setShowUserInfo] = useState(false);
  return (
    <View style={styles.headerContainer}>
      {/* Header Title */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* Header Icon */}
      <MaterialIcons
        name={materialIcon}
        size={24}
        color="black"
        style={{ marginRight: 12 }}
      />

      {/* Search Input */}
      <TextInput
        value={searchInput}
        onChangeText={setSearchInput}
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor={"#888"}
      />

      {/* Login Button */}
      {!user && (
        <TouchableOpacity
          style={styles.touchableOpacityButton}
          onPress={async () => {
            await signInWithGoogle();
          }}
        >
          <Text style={{ color: "white" }}>Login</Text>
        </TouchableOpacity>
      )}

      {/* User Avatar */}
      {user && (
        <TouchableOpacity
          style={{ marginRight: 12 }}
          onPress={() => {
            setShowUserInfo(!showUserInfo);
          }}
        >
          <Image
            source={{ uri: user.photoURL }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
            alt="User Avatar"
          />
        </TouchableOpacity>
      )}

      {/* User Info View */}
      {user && showUserInfo && (
        <>
          <TouchableOpacity
            style={styles.userInfoOverlay}
            onPress={() => setShowUserInfo(false)}
          />
          <View style={styles.userInfo}>
            <Text>Name: {user.displayName}</Text>
            <Text>Email: {user.email}</Text>
            {/* Logout */}
            <TouchableOpacity
              style={{
                marginTop: 6,
                ...styles.touchableOpacityButton,
                alignSelf: "flex-end",
              }}
              onPress={() => {
                const auth = getAuth();
                signOut(auth);
              }}
            >
              <Text style={{ color: "white" }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  userInfo: {
    position: "absolute",
    top: 50,
    right: 0,
    width: windowWidth / 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    zIndex: 1000,
    backgroundColor: "white",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  userInfoOverlay: {
    position: "absolute",
    top: -windowHeight / 2,
    left: -windowWidth / 2,
    right: 0,
    bottom: 0,
    height: windowHeight * 2,
    width: windowWidth * 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    opacity: 0.5,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
});
