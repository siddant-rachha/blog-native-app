import { Post } from "@/types/commonTypes";
import { imitateApi } from "@/utils/immitateApi";
import axiosInstance from "../apiInstance/axiosInstance";

interface GetAllPostsResponse {
  posts: Post[];
  message: string;
}

export const postsApi = {
  getAll: async (cursor: string | null, latest: boolean = true) => {
    const res = await axiosInstance.get<GetAllPostsResponse>(
      `/getposts?latest=${latest}&limit=3` +
        (cursor ? `&cursorId=${cursor}` : "")
    );
    return res.data;
  },

  getPostById: async (postId: string) => {
    const res = await axiosInstance.get<{ post: Post }>(
      `/getposts?id=${postId}`
    );
    return res.data;
  },

  getMyPosts: async (cursor: string | null, latest: boolean = true) => {
    await imitateApi(1000);
    const res = await axiosInstance.get<GetAllPostsResponse>(
      `/getposts?latest=${latest}&myposts=true&limit=3` +
        (cursor ? `&cursorId=${cursor}` : "")
    );
    return res.data;
  },

  deletePost: async (postId: string) => {
    const res = await axiosInstance.post(`/deletepost/`, { postId });
    return res.data;
  },

  searchPosts: async (query: string) => {
    const res = await axiosInstance.post<GetAllPostsResponse>(`/searchposts`, {
      query,
    });
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

  updatePost: async ({
    title,
    desc,
    imageString = "",
    imageUrl = "",
    postId,
  }: {
    title: string;
    desc: string;
    imageString: string;
    imageUrl: string;
    postId: string;
  }) => {
    const data = {
      title,
      desc,
      ...(imageString ? { imageString } : {}),
      ...(imageUrl ? { imageUrl } : {}),
    };

    const res = await axiosInstance.post(`/editpost?id=${postId}`, {
      ...data,
    });
    return res.data;
  },
};
