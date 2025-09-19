import useCreatePostHook from "@/hooks/CreatePostHook/useCreatePostHook";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;

export default function CreatePost() {
  const {
    selectors: { desc, imageString, title, user },
    actions: { onSubmit, onUploadImage, setDesc, setImageString, setTitle },
  } = useCreatePostHook();
  return (
    <ScrollView style={styles.createPostContainer}>
      <Text style={styles.title}>Create Blog Post</Text>
      <TextInput
        style={styles.nameInput}
        defaultValue={user?.displayName || "Author: Anonymous"}
        editable={false}
      />
      <TextInput
        value={title}
        style={styles.blogTitleInput}
        placeholder="Blog Title"
        onChangeText={(text) => setTitle(text)}
        maxLength={50}
        placeholderTextColor="#A9A9A9"
      />
      <Text style={styles.maxLengthCaption}>{title.length}/50</Text>
      <TextInput
        value={desc}
        style={styles.descriptionInput}
        placeholder="Description"
        multiline
        onChangeText={(text) => setDesc(text)}
        maxLength={5000}
        placeholderTextColor="#A9A9A9"
      />
      <Text style={styles.maxLengthCaption}>{desc.length}/5000</Text>

      {/* upload image feature */}
      <View style={{ flexDirection: "row", gap: 16, alignItems: "flex-start" }}>
        <TouchableOpacity
          style={styles.uploadImageButton}
          onPress={() => onUploadImage()}
          disabled={!!imageString}
        >
          <MaterialIcons
            name="cloud-upload"
            size={18}
            color={!imageString ? "#007BFF" : "#A9A9A9"}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontSize: 12,
              color: !imageString ? "#007BFF" : "#A9A9A9",
            }}
          >
            Upload Image
          </Text>
        </TouchableOpacity>

        {imageString ? (
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: imageString }}
              style={{
                height: screenHeight * 0.1,
                aspectRatio: 9 / 6,
                borderRadius: 8,
              }}
            />
            <MaterialIcons
              name="cancel"
              size={22}
              style={{
                position: "absolute",
                right: -12,
                top: -12,
              }}
              color={"gray"}
              onPress={() => setImageString(null)}
            />
          </View>
        ) : (
          <Text style={{ fontSize: 12, color: "#A9A9A9" }}>
            No image selected / (optional)
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          onSubmit();
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  createPostContainer: {
    flex: 1,
    margin: 16,
    padding: 24,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "400",
    marginBottom: 16,
  },
  nameInput: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ccc",
    paddingLeft: 8,
    backgroundColor: "#E6E6E6",
  },
  blogTitleInput: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ccc",
  },
  descriptionInput: {
    height: screenHeight * 0.3,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ccc",
    textAlignVertical: "top",
  },
  uploadImageButton: {
    backgroundColor: "#E6E6E6",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    flexDirection: "row",
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  maxLengthCaption: {
    marginBottom: 12,
    fontSize: 12,
    color: "gray",
    alignSelf: "flex-end",
  },
});
