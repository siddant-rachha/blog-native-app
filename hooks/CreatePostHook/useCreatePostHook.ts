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

  const onSubmit = async (type: "edit" | "create", id: string | undefined) => {
    if (title && desc) {
      try {
        setIsLoading(true);
        // check if imageString is a base64 string or a url
        const isBase64 = (str: string) => {
          return /^data:image\/[a-zA-Z]+;base64,/.test(str);
        };

        if (type === "edit") {
          await postsApi.updatePost({
            title,
            desc,
            postId: id as string,
            imageString:
              imageString && isBase64(imageString) ? imageString : "",
            imageUrl: imageString && !isBase64(imageString) ? imageString : "",
          });
          showToast("Post updated, fetching posts...");
          setTitle("");
          setDesc("");
          setImageString(null);
        } else {
          // type === 'create'
          await postsApi.createPost({
            title,
            desc,
            imageString,
          });
          showToast("Post created, fetching posts...");
          setTitle("");
          setDesc("");
          setImageString(null);
        }

        // fetch all posts and my posts in parallel
        const [allPosts, myPosts] = await Promise.all([
          postsApi.getAll(null, true),
          user
            ? postsApi.getMyPosts(null, true)
            : Promise.resolve({ posts: [] }),
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

        // navigate to home if user not logged in else navigate to my-posts
        if (user) {
          router.push("/my-posts");
        } else {
          router.push("/");
        }
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

  const fetchPostDataForEdit = async (id: string) => {
    try {
      setIsLoading(true);
      const postData = await postsApi.getPostById(id);
      setTitle(postData.post.title);
      setDesc(postData.post.desc);
      setImageString(postData.post.imageUrl || null);
    } catch (error) {
      console.log("Error fetching post data:", error);
      showToast("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    actions: {
      onUploadImage,
      onSubmit,
      setDesc,
      setImageString,
      setTitle,
      fetchPostDataForEdit,
    },
    selectors: { title, desc, imageString, user },
  };
}
