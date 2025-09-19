export interface Post {
  id: string;
  title: string;
  desc: string;
  author: string;
  imageUrl?: string;
  authorPic?: string;
  createdAt: { _seconds: number; _nanoseconds: number };
  writePermission: boolean;
}

export const Routes = {
  index: "Home" as const,
  "create-post": "CreatePost" as const,
  "my-posts": "MyPosts" as const,
  "post/[id]": "Post" as const,
};

export type RoutesKey = keyof typeof Routes;
