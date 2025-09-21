import { postsApi } from "@/api/services/postsApi";
import CardComponent from "@/components/CardComponent";
import { useGetScreen } from "@/hooks/useGetScreen";
import { useToast } from "@/hooks/useToast";
import { useGlobalState } from "@/store/context/useGlobalState";
import { RoutesKey } from "@/types/commonTypes";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";

export default function Home() {
  const router = useRouter();
  const { currentScreen } = useGetScreen();
  const {
    selectors: { user, allPosts, myPosts },
    actions: { setIsLoading, setModalConfirmation, setAllPosts, setMyPosts },
  } = useGlobalState();
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMorePosts = async () => {
    if (!loadingMore && cursor) {
      await getAllPosts(true, cursor);
    }
  };

  const getAllPosts = async (append = false, cursorId: string | null) => {
    try {
      if (append) setLoadingMore(true);
      else setIsLoading(true);
      const res = await postsApi.getAll(cursorId);
      setCursor(res.posts.length ? res.posts[res.posts.length - 1].id : null);
      const posts = res.posts.map((post) => ({
        ...post,
        desc: post.desc.slice(0, 150) + "...",
      }));
      if (append) {
        setAllPosts([...allPosts, ...posts]);
      } else {
        setAllPosts(posts);
      }
      if (currentScreen === "Home" && !append) {
        showToast("Posts fetched");
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
      if (currentScreen === "Home") {
        showToast("Something went wrong", "error");
      }
    } finally {
      if (append) setLoadingMore(false);
      else setIsLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      setIsLoading(true);
      await postsApi.deletePost(postId);
      showToast("Post deleted");
      // remove postId from state
      const updatedAllPosts = allPosts.filter((post) => post.id !== postId);
      const updatedMyPosts = myPosts.filter((post) => post.id !== postId);
      setAllPosts(updatedAllPosts);
      setMyPosts(updatedMyPosts);
    } catch (error) {
      console.log("Error deleting post:", error);
      showToast("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllPosts(false, null);
    setRefreshing(false);
  };

  useEffect(() => {
    getAllPosts(false, null);
  }, [user]);

  return (
    <FlatList
      style={styles.container}
      data={allPosts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <CardComponent
          key={item.id}
          postItem={item}
          onDelete={() => {
            setModalConfirmation(true, () => deletePost(item.id));
          }}
          onEdit={() => {
            setModalConfirmation(
              true,
              () => {
                router.push({
                  pathname: "/edit-post",
                  params: {
                    id: item.id,
                    postComingFromParam: "index" as RoutesKey,
                  },
                });
              },
              "edit"
            );
          }}
          onReadClick={() => {
            router.push({
              pathname: "/post/[id]",
              params: {
                id: item.id,
                postComingFromParam: "index" as RoutesKey,
              },
            });
          }}
        />
      )}
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={fetchMorePosts}
      onEndReachedThreshold={0}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator size="large" style={{ marginBottom: 36 }} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
