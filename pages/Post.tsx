import { postsApi } from "@/api/services/postsApi";
import { useToast } from "@/hooks/useToast";
import { useGlobalState } from "@/store/context/useGlobalState";
import { Post, RoutesKey } from "@/types/commonTypes";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostComponent() {
  const { id, postComingFromParam } = useLocalSearchParams();
  const postComingFromParamTyped = postComingFromParam as RoutesKey;
  const router = useRouter();
  const {
    actions: {
      setPostComingFrom,
      setIsLoading,
      setModalConfirmation,
      setAllPosts,
      setMyPosts,
    },
    selectors: { allPosts, myPosts },
  } = useGlobalState();
  const toast = useToast();
  const [post, setPostState] = useState<Post | null>(null);

  const setPost = (postData: Post | null) => {
    setPostState(postData);
  };

  useEffect(() => {
    setPostComingFrom(postComingFromParamTyped);
  }, [postComingFromParamTyped]);

  const backAction = () => {
    if (postComingFromParamTyped === "my-posts") {
      router.replace("/my-posts");
    } else if (postComingFromParamTyped === "index") {
      router.replace("/");
    } else {
      router.replace("/");
    }
    return false; // or return undefined
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [postComingFromParamTyped]);

  const getPostById = async (postId: string) => {
    try {
      setPost(null);
      setIsLoading(true);
      const res = await postsApi.getPostById(postId);
      setPost(res.post);
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      toast.showToast("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await postsApi.deletePost(id as string);
      toast.showToast("Post deleted");
      // remove postId from state
      const updatedAllPosts = allPosts.filter((post) => post.id !== id);
      const updatedMyPosts = myPosts.filter((post) => post.id !== id);
      setAllPosts(updatedAllPosts);
      setMyPosts(updatedMyPosts);
      // navigate back to previous screen based on postComingFromParam
      if (postComingFromParamTyped === "my-posts") {
        router.replace("/my-posts");
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.showToast("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostById(id as string);
  }, [id]);

  if (!post) return null;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* image */}
        <Image
          source={
            post?.imageUrl
              ? { uri: post.imageUrl }
              : require("../assets/images/no-img.png")
          }
          style={styles.image}
        />
        <View style={styles.titleDescContainer}>
          {/* title */}
          <Text style={styles.title}>{post?.title}</Text>

          {/* author, date, controls */}
          <View style={styles.authorControls}>
            {/* author logo , author name, date */}
            <View style={styles.authorContainer}>
              <Image
                source={
                  post?.authorPic
                    ? { uri: post.authorPic }
                    : require("../assets/images/no-img.png")
                }
                style={styles.authorImage}
              />
              <View>
                <Text style={styles.authorName}>{post?.author}</Text>
                <Text style={styles.authorDate}>
                  {post?.createdAt._seconds}
                </Text>
              </View>
            </View>

            {/* Edit and Delete button  */}
            {post && post.writePermission && (
              <View style={styles.editDeleteContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setModalConfirmation(true, () => {}, "edit");
                  }}
                >
                  <MaterialIcons name="edit" size={24} color={"#007BFF"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalConfirmation(true, onDelete);
                  }}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color={"#FF3B30"}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* description */}
          <Text style={{ textAlign: "justify" }}>
            {post?.desc.replace(/\\r\\n|\\n|\\r/g, "\n")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 24,
    paddingBottom: 24,
  },
  image: {
    width: "100%",
    height: "auto",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    marginBottom: 12,
  },
  titleDescContainer: { paddingHorizontal: 18 },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 12,
  },
  editDeleteContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 16,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  authorImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  authorName: { fontWeight: "bold" },
  authorDate: { fontSize: 12, color: "#666" },
  authorControls: { flexDirection: "row", alignItems: "center", width: "100%" },
});
