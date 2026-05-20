// =============================================================================
// Features: Post - TanStack Query Hooks
// =============================================================================
// Query hooks for blog post data fetching and mutations.
// =============================================================================

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { postService } from '@/services/post.service';
import type { PostQueryParams, PostRequest } from '@/types/post.type';

/** Query key factory — prevents key collisions and enables targeted invalidation */
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params: PostQueryParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (slug: string) => [...postKeys.details(), slug] as const,
};

/** Fetch paginated posts */
export function usePostsQuery(params?: PostQueryParams) {
  return useQuery({
    queryKey: postKeys.list(params ?? {}),
    queryFn: () => postService.getAll(params).then((res) => res.data),
  });
}

/** Fetch a single post by slug */
export function usePostQuery(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: () => postService.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

/** Create a new post */
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostRequest) => postService.create(data).then((res) => res.data),
    onSuccess: () => {
      // Invalidate all post lists to refetch with the new post
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

/** Update an existing post */
export function useUpdatePostMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostRequest) => postService.update(id, data).then((res) => res.data),
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.setQueryData(postKeys.detail(updatedPost.slug), updatedPost);
    },
  });
}

/** Delete a post */
export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
