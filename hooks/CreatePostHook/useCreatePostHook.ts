import { postsApi } from "@/api/services/postsApi";
import { useGlobalState } from "@/store/context/useGlobalState";
import { compressImageToTarget } from "@/utils/image-helpers/compressImageToTarget";
import {
  requestCameraPermission,
  requestGalleryPermission,
} from "@/utils/permission-helpers/requestPermission";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { useToast } from "../useToast";

export default function useCreatePostHook() {
  const {
    selectors: { user },
    actions: { setIsLoading, setAllPosts, setMyPosts },
  } = useGlobalState();
  const { showToast } = useToast();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageString, setImageString] = useState<string | null>(null);

  const onUploadImage = () => {
    Alert.alert("Upload Image", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Camera",
        onPress: async () => {
          const granted = await requestCameraPermission();
          if (!granted) return;

          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [9, 6],
          });

          if (!result.canceled) {
            const compressedUri = await compressImageToTarget(
              result.assets[0].uri,
              500
            );
            const response = await fetch(compressedUri);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result;
              setImageString(base64data as string);
              console.log(base64data);
            };
            reader.readAsDataURL(blob);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const granted = await requestGalleryPermission();
          if (!granted) return;

          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [9, 6],
          });

          if (!result.canceled) {
            const compressedUri = await compressImageToTarget(
              result.assets[0].uri,
              500
            );
            const response = await fetch(compressedUri);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result;
              setImageString(base64data as string);
              console.log(base64data);
            };
            reader.readAsDataURL(blob);
          }
        },
      },
    ]);
  };

  const onSubmit = async () => {
    if (title && desc) {
      try {
        setIsLoading(true);
        await postsApi.createPost({
          title,
          desc,
          imageString,
        });
        showToast("Post created, fetching posts...");
        setTitle("");
        setDesc("");
        setImageString(null);

        // fetch all posts and my posts in parallel
        const [allPosts, myPosts] = await Promise.all([
          postsApi.getAll(),
          user ? postsApi.getMyPosts() : Promise.resolve({ posts: [] }),
        ]);
        const updatedAllPosts = allPosts.posts.map((post) => {
          if (post.desc.length > 150) {
            return { ...post, desc: post.desc.slice(0, 150) + "..." };
          }
          return post;
        });
        const updatedMyPosts = myPosts.posts.map((post) => {
          if (post.desc.length > 150) {
            return { ...post, desc: post.desc.slice(0, 150) + "..." };
          }
          return post;
        });
        setAllPosts(updatedAllPosts);
        setMyPosts(updatedMyPosts);
        //

        // navigate to home after promises are resolved
        router.push("/my-posts");
      } catch (error) {
        console.log("Error creating post:", error);
        showToast("Something went wrong", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert(
        `Please fill fields: ${title ? "" : "'Blog Title'"}  ${
          desc ? "" : "'Description'"
        }`
      );
    }
  };

  return {
    actions: { onUploadImage, onSubmit, setDesc, setImageString, setTitle },
    selectors: { title, desc, imageString, user },
  };
}
