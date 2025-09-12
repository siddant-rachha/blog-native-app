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
