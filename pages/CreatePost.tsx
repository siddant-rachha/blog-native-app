import { postsApi } from "@/api/services/postsApi";
import { useToast } from "@/hooks/useToast";
import { useGlobalState } from "@/store/context/useGlobalState";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const screenHeight = Dimensions.get("window").height;

export default function CreatePost() {
  const {
    selectors: { user },
    actions: { setIsLoading },
  } = useGlobalState();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const onUploadImage = () => {};

  const onSubmit = async () => {
    if (title && desc) {
      try {
        setIsLoading(true);
        await postsApi.createPost({
          title,
          desc,
        });
        showToast("Post created");
        setTitle("");
        setDesc("");
      } catch (error) {
        console.log("Error creating post:", error);
        showToast("Something went wrong", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert(
        `Please fill fields: ${title ? "" : "'Blog Title'"}, ${
          desc ? "" : "'Description'"
        }`
      );
    }
  };
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
      />
      <Text style={styles.maxLengthCaption}>{title.length}/50</Text>
      <TextInput
        value={desc}
        style={styles.descriptionInput}
        placeholder="Description"
        multiline
        onChangeText={(text) => setDesc(text)}
        maxLength={5000}
      />
      <Text style={styles.maxLengthCaption}>{desc.length}/5000</Text>

      {/* upload image feature */}
      <TouchableOpacity
        style={styles.uploadImageButton}
        onPress={() => onUploadImage()}
      >
        <MaterialIcons
          name="cloud-upload"
          size={18}
          color="#007BFF"
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: "#007BFF", fontSize: 12 }}>Upload Image</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          console.log("submit clicked");
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
    height: 40,
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ccc",
    paddingLeft: 8,
    backgroundColor: "#E6E6E6",
    color: "gray",
  },
  blogTitleInput: {
    height: 40,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ccc",
  },
  descriptionInput: {
    height: screenHeight * 0.4,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ccc",
    textAlignVertical: "top",
  },
  uploadImageButton: {
    backgroundColor: "#E6E6E6", // shade of grey
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    flexDirection: "row",
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
