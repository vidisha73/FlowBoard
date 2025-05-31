// Define a serialized board interface for use in client components
export interface SerializedBoard {
  _id: string;
  id: string;
  title: string;
  orgId: string;
  imageId: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  imageUserName: string;
  imageLinkHTML: string;
  createdAt: string | null;
  updatedAt: string | null;
} 