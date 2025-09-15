import { postsApi } from "@/api/services/postsApi";
import CardComponent from "@/components/CardComponent";
import { useToast } from "@/hooks/useToast";
import { useGlobalState } from "@/store/context/useGlobalState";
import { Post } from "@/types/commonTypes";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";

export default function MyPosts() {
  const {
    selectors: { user },
    actions: { setIsLoading },
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
      showToast("My Posts fetched");
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

  useEffect(() => {
    console.log(user);
    getMyPosts();
  }, [user]);

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
