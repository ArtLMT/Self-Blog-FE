// =============================================================================
// Types: Post / Blog
// =============================================================================
// Post-related type definitions for the blog feature.
// =============================================================================

/** Post status enum */
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

/** Core post representation */
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  status: PostStatus;
  tags: string[];
  author: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/** Request payload for creating/updating a post */
export interface PostRequest {
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl?: string;
  status: PostStatus;
  tags: string[];
}

/** Paginated response wrapper (matches Spring Boot Page) */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
  first: boolean;
  last: boolean;
}

/** Query parameters for fetching posts */
export interface PostQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  tag?: string;
  status?: PostStatus;
}
