import { Post } from "@/types/commonTypes";
import axiosInstance from "../apiInstance/axiosInstance";

interface GetAllPostsResponse {
  posts: Post[];
  message: string;
}

export const postsApi = {
  getAll: async (latest: boolean = true) => {
    const res = await axiosInstance.get<GetAllPostsResponse>(
      `/getposts?latest=${latest}`
    );
    return res.data;
  },

  getMyPosts: async (latest: boolean = true) => {
    const res = await axiosInstance.get<GetAllPostsResponse>(
      `/getposts?latest=${latest}&myposts=true`
    );
    return res.data;
  },

  deletePost: async (postId: string) => {
    const res = await axiosInstance.post(`/deletepost/`, { postId });
    return res.data;
  },
};
