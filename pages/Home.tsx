import { postsApi } from "@/api/services/postsApi";
import CardComponent from "@/components/CardComponent";
import { useGlobalState } from "@/store/context/useGlobalState";
import { Post } from "@/types/commonTypes";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";

export default function Home() {
  const {
    actions: { setIsLoading },
  } = useGlobalState();
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
    } catch (error) {
      console.log("Error fetching posts:", error);
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
  }, []);

  return (
    <FlatList
      style={styles.container}
      data={posts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <CardComponent postItem={item} />}
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
