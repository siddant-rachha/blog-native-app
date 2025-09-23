import { postsApi } from "@/api/services/postsApi";
import CardComponent from "@/components/CardComponent";
import Dropdown from "@/components/DropdownComponent";
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
  ScrollView,
  StyleSheet,
  Text,
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
  const [sortOrder, setSortOrder] = useState<"Latest" | "Oldest">("Latest");
  const [hasError, setHasError] = useState(false);

  const fetchMorePosts = async () => {
    if (!loadingMore && cursor) {
      await getAllPosts(true, cursor, sortOrder);
    }
  };

  const getAllPosts = async (
    append = false,
    cursorId: string | null,
    value: "Latest" | "Oldest"
  ) => {
    try {
      setHasError(false);
      if (append) setLoadingMore(true);
      else setIsLoading(true);
      const res = await postsApi.getAll(cursorId, value === "Latest");
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
      setSortOrder(value);
    } catch (error) {
      setHasError(true);
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
    await getAllPosts(false, null, sortOrder);
    setRefreshing(false);
  };

  const onDropdownChange = (value: "Latest" | "Oldest") => {
    if (value === sortOrder) return;
    getAllPosts(false, null, value);
  };

  useEffect(() => {
    getAllPosts(false, null, sortOrder);
  }, [user]);

  if (hasError) {
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={{ textAlign: "center", marginTop: 32, fontSize: 18 }}>
          Something went wrong. Pull down to refresh.
        </Text>
      </ScrollView>
    );
  }

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
      onScrollEndDrag={fetchMorePosts}
      onEndReachedThreshold={0}
      ListHeaderComponent={
        <Dropdown
          items={[
            { label: "Latest", value: "Latest" },
            { label: "Oldest", value: "Oldest" },
          ]}
          value={sortOrder}
          onValueChange={onDropdownChange}
          style={{ marginBottom: 16, width: "50%" }}
        />
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            size="large"
            color="#007bff"
            style={{
              position: "relative",
              zIndex: 1000,
              top: -25,
            }}
          />
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
