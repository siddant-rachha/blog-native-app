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

  createPost: async ({
    title,
    desc,
    imageString,
  }: {
    title: string;
    desc: string;
    imageString: string | null;
  }) => {
    const data = {
      title,
      desc,
      ...(imageString ? { imageString } : {}),
    };

    const res = await axiosInstance.post(`/createpost/`, { ...data });
    return res.data;
  },
};
