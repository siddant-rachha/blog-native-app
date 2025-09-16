import { postsApi } from "@/api/services/postsApi";
import CardComponent from "@/components/CardComponent";
import { useToast } from "@/hooks/useToast";
import { useGlobalState } from "@/store/context/useGlobalState";
import { Post, Routes, RoutesKey } from "@/types/commonTypes";
import { useNavigationContainerRef } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";

export default function Home() {
  const navigationRef = useNavigationContainerRef();
  const screen = Routes[navigationRef.getCurrentRoute()?.name as RoutesKey];
  const {
    selectors: { user },
    actions: { setIsLoading, setModalConfirmation },
  } = useGlobalState();
  const { showToast } = useToast();
  const [posts, setPostsState] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const setAllPosts = (allPosts: Post[] | undefined) => {
    if (allPosts) {
      setPostsState(allPosts);
    }
  };

  const getAllPosts = async () => {
    try {
      setIsLoading(true);
      const res = await postsApi.getAll();
      const posts = res.posts;
      posts.map((post) => {
        post.desc = post.desc.slice(0, 150) + "...";
      });
      setAllPosts(posts);
      if (screen === "Home") {
        showToast("Posts fetched");
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
      showToast("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      setIsLoading(true);
      await postsApi.deletePost(postId);
      showToast("Post deleted");
      // remove postId from state
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setAllPosts(updatedPosts);
    } catch (error) {
      console.log("Error deleting post:", error);
      showToast("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAllPosts();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getAllPosts();
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
