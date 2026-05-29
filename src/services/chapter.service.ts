// =============================================================================
// Services: Chapter Service
// =============================================================================
// Handles public and administrative API interactions for Chapters.
// =============================================================================

import apiClient from '@/services/axios';
import type { ApiResponse } from '@/types/auth.type';
import type {
  PublicChapterResponseDTO,
  AdminChapterResponseDTO,
  ChapterRequestDTO,
} from '@/types/models';

export const chapterService = {
  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /** Fetch all published chapters for a specific arc */
  getPublicChaptersByArc: (arcSlug: string) =>
    apiClient.get<ApiResponse<PublicChapterResponseDTO[]>>(`/public/chapters/arc/${arcSlug}`),

  /** Fetch a single published chapter by slug */
  getPublicChapterBySlug: (slug: string) =>
    apiClient.get<ApiResponse<PublicChapterResponseDTO>>(`/public/chapters/${slug}`),

  // ---------------------------------------------------------------------------
  // Admin API (Requires Editorial Access)
  // ---------------------------------------------------------------------------

  /** Create a new chapter */
  createChapter: (data: ChapterRequestDTO) =>
    apiClient.post<ApiResponse<AdminChapterResponseDTO>>('/admin/chapters', data),

  /** Update an existing chapter */
  updateChapter: (id: string, data: ChapterRequestDTO) =>
    apiClient.put<ApiResponse<AdminChapterResponseDTO>>(`/admin/chapters/${id}`, data),

  /** Fetch a single chapter by UUID */
  getAdminChapterById: (id: string) =>
    apiClient.get<ApiResponse<AdminChapterResponseDTO>>(`/admin/chapters/${id}`),

  /** Fetch all chapters belonging to a specific arc by UUID */
  getAdminChaptersByArc: (arcId: string) =>
    apiClient.get<ApiResponse<AdminChapterResponseDTO[]>>(`/admin/chapters/arc/${arcId}`),

  /** Soft delete/lock a chapter */
  deleteChapter: (id: string) =>
    apiClient.delete<ApiResponse<unknown>>(`/admin/chapters/${id}`),
};
