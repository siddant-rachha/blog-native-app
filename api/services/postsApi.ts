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

  create: async (title: string, content: string) => {
    const res = await axiosInstance.post("/posts", { title, content });
    return res.data;
  },

  update: async (id: string, data: { title?: string; content?: string }) => {
    const res = await axiosInstance.post(`/posts/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await axiosInstance.post(`/posts/${id}`);
    return res.data;
  },
};
