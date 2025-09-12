import { postsApi } from "@/api/services/postsApi";
import CardComponent from "@/components/CardComponent";
import { Post } from "@/types/commonTypes";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

export default function Home() {
  const [posts, setPostsState] = useState<Post[]>([]);
  const setAllPosts = (allPosts: Post[] | undefined) => {
    if (allPosts) {
      setPostsState(allPosts);
    }
  };

  const getAllPosts = async () => {
    try {
      const res = await postsApi.getAll();
      const posts = res.posts;
      posts.map((post) => {
        post.desc = post.desc.slice(0, 150) + "...";
      });
      setAllPosts(posts);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

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
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
