import { postsApi } from "@/api/services/postsApi";
import CardComponent from "@/components/CardComponent";
import { useToast } from "@/hooks/useToast";
import { useGlobalState } from "@/store/context/useGlobalState";
import { Post, Routes, RoutesKey } from "@/types/commonTypes";
import { useNavigationContainerRef } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";

export default function MyPosts() {
  const navigationRef = useNavigationContainerRef();
  const screen = Routes[navigationRef.getCurrentRoute()?.name as RoutesKey];

  const {
    selectors: { user },
    actions: { setIsLoading, setModalConfirmation },
  } = useGlobalState();
  const { showToast } = useToast();
  const [posts, setPostsState] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const setMyPosts = (myPosts: Post[] | undefined) => {
    if (myPosts) {
      setPostsState(myPosts);
    }
  };

  const getMyPosts = async () => {
    try {
      setIsLoading(true);
      const res = await postsApi.getMyPosts();
      const posts = res.posts;
      posts.map((post) => {
        post.desc = post.desc.slice(0, 150) + "...";
      });
      setMyPosts(posts);
      if (screen === "MyPosts") {
        showToast("My Posts fetched");
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
      showToast("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getMyPosts();
    setRefreshing(false);
  }, []);

  const deletePost = async (postId: string) => {
    try {
      setIsLoading(true);
      await postsApi.deletePost(postId);
      showToast("Post deleted");

      // remove postId from state
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setMyPosts(updatedPosts);
    } catch (error) {
      console.log("Error deleting post:", error);
      showToast("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyPosts();
  }, [user]);

  return (
    <FlatList
      style={styles.container}
      data={posts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <CardComponent
          key={item.id}
          postItem={item}
          onDelete={() => {
            setModalConfirmation(true, () => deletePost(item.id));
          }}
        />
      )}
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
