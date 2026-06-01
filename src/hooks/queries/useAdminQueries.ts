// =============================================================================
// Features: Post - TanStack Query Hooks (Admin)
// =============================================================================
// Feature-based organization for managing writing content: Arcs, Chapters,
// and Episodes. These hooks integrate with backend admin services and handle
// caching, automatic invalidation, and background updates.
// =============================================================================

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { arcService } from '@/services/arc.service';
import { chapterService } from '@/services/chapter.service';
import { episodeService } from '@/services/episode.service';
import type { 
  ArcRequestDTO, 
  ChapterRequestDTO, 
  EpisodeRequestDTO 
} from '@/types/models';
import type { ChapterFormValues, EpisodeFormValues } from '@/lib/validators/content.schema';

/**
 * Cache key factory for admin state.
 * Keeps keys organized to allow targeted cache invalidation.
 */
export const adminKeys = {
  all: ['admin'] as const,
  arcs: () => [...adminKeys.all, 'arcs'] as const,
  arc: (id: string) => [...adminKeys.all, 'arc', id] as const,
};

/**
 * Hook to fetch the entire administrative writing hierarchy.
 * Returns nested Arcs ➔ Chapters ➔ Episodes structure.
 */
export function useAdminArcsQuery() {
  return useQuery({
    queryKey: adminKeys.arcs(),
    queryFn: async () => {
      const response = await arcService.getAdminArcs();
      return response.data.data ?? [];
    },
  });
}

// ---------------------------------------------------------------------------
// Arc Mutations
// ---------------------------------------------------------------------------

/** Mutation hook to create a new Arc */
export function useCreateArcMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ArcRequestDTO) => arcService.createArc(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.arcs() });
    },
  });
}

/** Mutation hook to update an existing Arc */
export function useUpdateArcMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ArcRequestDTO }) => 
      arcService.updateArc(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.arcs() });
    },
  });
}

/** Mutation hook to soft-delete an Arc */
export function useDeleteArcMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => arcService.deleteArc(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.arcs() });
    },
  });
}

// ---------------------------------------------------------------------------
// Chapter Mutations
// ---------------------------------------------------------------------------

const mapFormToChapterRequest = (data: ChapterFormValues): ChapterRequestDTO => ({
  language: data.language,
  title: data.title,
  slug: data.slug,
  summary: data.content || undefined,
  orderIndex: data.displayOrder,
  status: data.status,
  publishedAt: data.publishDate || undefined,
  authorNotes: data.authorNotes || undefined,
  arcId: data.arcId,
});

/** Mutation hook to create a new Chapter */
export function useCreateChapterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChapterFormValues) => 
      chapterService.createChapter(mapFormToChapterRequest(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.arcs() });
    },
  });
}

/** Mutation hook to update an existing Chapter */
export function useUpdateChapterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChapterFormValues }) => 
      chapterService.updateChapter(id, mapFormToChapterRequest(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.arcs() });
    },
  });
}

/** Mutation hook to delete/lock a Chapter */
export function useDeleteChapterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chapterService.deleteChapter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.arcs() });
    },
  });
}

// ---------------------------------------------------------------------------
// Episode Mutations
// ---------------------------------------------------------------------------

const mapFormToEpisodeRequest = (data: EpisodeFormValues): EpisodeRequestDTO => ({
  language: data.language,
  title: data.title,
  slug: data.slug,
  markdownContent: data.content,
  orderIndex: data.displayOrder,
  status: data.status,
  eventDate: data.publishDate || new Date().toISOString(),
  authorNotes: data.authorNotes || undefined,
  chapterId: data.chapterId,
});

/** Mutation hook to create a new Episode */
export function useCreateEpisodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EpisodeFormValues) => 
      episodeService.createEpisode(mapFormToEpisodeRequest(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.arcs() });
    },
  });
}

/** Mutation hook to update an existing Episode */
export function useUpdateEpisodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EpisodeFormValues }) => 
      episodeService.updateEpisode(id, mapFormToEpisodeRequest(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.arcs() });
    },
  });
}

/** Mutation hook to soft-delete an Episode */
export function useDeleteEpisodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => episodeService.deleteEpisode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.arcs() });
    },
  });
}
