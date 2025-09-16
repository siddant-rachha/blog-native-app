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

  createPost: async ({ title, desc }: { title: string; desc: string }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    const res = await axiosInstance.post(`/createpost/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};
