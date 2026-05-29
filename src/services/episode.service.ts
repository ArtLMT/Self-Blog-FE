// =============================================================================
// Services: Episode Service
// =============================================================================
// Handles public and administrative API interactions for Episodes.
// =============================================================================

import apiClient from '@/services/axios';
import type { ApiResponse } from '@/types/auth.type';
import type {
  PublicEpisodeResponseDTO,
  AdminEpisodeResponseDTO,
  EpisodeRequestDTO,
} from '@/types/models';

export const episodeService = {
  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /** Fetch all published episodes for a specific chapter */
  getPublicEpisodesByChapter: (chapterSlug: string) =>
    apiClient.get<ApiResponse<PublicEpisodeResponseDTO[]>>(`/public/episodes/chapter/${chapterSlug}`),

  /** Fetch a single published episode by slug */
  getPublicEpisodeBySlug: (slug: string) =>
    apiClient.get<ApiResponse<PublicEpisodeResponseDTO>>(`/public/episodes/${slug}`),

  // ---------------------------------------------------------------------------
  // Admin API (Requires Editorial Access)
  // ---------------------------------------------------------------------------

  /** Create a new episode */
  createEpisode: (data: EpisodeRequestDTO) =>
    apiClient.post<ApiResponse<AdminEpisodeResponseDTO>>('/admin/episodes', data),

  /** Update an existing episode */
  updateEpisode: (id: string, data: EpisodeRequestDTO) =>
    apiClient.put<ApiResponse<AdminEpisodeResponseDTO>>(`/admin/episodes/${id}`, data),

  /** Fetch a single episode by UUID */
  getAdminEpisodeById: (id: string) =>
    apiClient.get<ApiResponse<AdminEpisodeResponseDTO>>(`/admin/episodes/${id}`),

  /** Fetch all episodes belonging to a specific chapter by UUID */
  getAdminEpisodesByChapter: (chapterId: string) =>
    apiClient.get<ApiResponse<AdminEpisodeResponseDTO[]>>(`/admin/episodes/chapter/${chapterId}`),

  /** Soft delete an episode */
  deleteEpisode: (id: string) =>
    apiClient.delete<ApiResponse<unknown>>(`/admin/episodes/${id}`),
};
