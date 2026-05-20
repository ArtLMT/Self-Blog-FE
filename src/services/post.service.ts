// =============================================================================
// Services: Post Service
// =============================================================================
// API calls related to blog posts (CRUD operations).
// =============================================================================

import apiClient from '@/services/axios';
import type { PaginatedResponse, Post, PostQueryParams, PostRequest } from '@/types/post.type';

const POSTS_PREFIX = '/posts';

export const postService = {
  /** Fetch paginated list of posts */
  getAll: (params?: PostQueryParams) =>
    apiClient.get<PaginatedResponse<Post>>(POSTS_PREFIX, { params }),

  /** Fetch a single post by slug */
  getBySlug: (slug: string) =>
    apiClient.get<Post>(`${POSTS_PREFIX}/slug/${slug}`),

  /** Fetch a single post by ID */
  getById: (id: string) => apiClient.get<Post>(`${POSTS_PREFIX}/${id}`),

  /** Create a new post (requires auth) */
  create: (data: PostRequest) =>
    apiClient.post<Post>(POSTS_PREFIX, data),

  /** Update an existing post (requires auth) */
  update: (id: string, data: PostRequest) =>
    apiClient.put<Post>(`${POSTS_PREFIX}/${id}`, data),

  /** Delete a post (requires auth) */
  delete: (id: string) => apiClient.delete(`${POSTS_PREFIX}/${id}`),
};
