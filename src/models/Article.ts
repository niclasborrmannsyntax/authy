export interface Topic {
  id: number;
  documentId: string;
  Title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ArticleImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface ArticleImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  focalPoint: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ArticleImageFormat;
    large: ArticleImageFormat;
    medium: ArticleImageFormat;
    small: ArticleImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  topics: Topic[];
  image: ArticleImage;
}
