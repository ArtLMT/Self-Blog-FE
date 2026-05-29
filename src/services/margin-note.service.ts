// =============================================================================
// Services: Margin Note Service
// =============================================================================
// Handles administrative API interactions for Margin Notes.
// =============================================================================

import apiClient from '@/services/axios';
import type { ApiResponse } from '@/types/auth.type';
import type {
  AdminMarginNoteResponseDTO,
  MarginNoteRequestDTO,
} from '@/types/models';

export const marginNoteService = {
  // ---------------------------------------------------------------------------
  // Admin API (Requires Editorial Access)
  // ---------------------------------------------------------------------------

  /** Create a new margin note */
  createMarginNote: (data: MarginNoteRequestDTO) =>
    apiClient.post<ApiResponse<AdminMarginNoteResponseDTO>>('/admin/margin-notes', data),

  /** Update an existing margin note */
  updateMarginNote: (id: string, data: MarginNoteRequestDTO) =>
    apiClient.put<ApiResponse<AdminMarginNoteResponseDTO>>(`/admin/margin-notes/${id}`, data),

  /** Fetch a single margin note by UUID */
  getAdminMarginNoteById: (id: string) =>
    apiClient.get<ApiResponse<AdminMarginNoteResponseDTO>>(`/admin/margin-notes/${id}`),

  /** Fetch all margin notes belonging to a specific episode by UUID */
  getAdminMarginNotesByEpisode: (episodeId: string) =>
    apiClient.get<ApiResponse<AdminMarginNoteResponseDTO[]>>(`/admin/margin-notes/episode/${episodeId}`),

  /** Soft delete a margin note */
  deleteMarginNote: (id: string) =>
    apiClient.delete<ApiResponse<unknown>>(`/admin/margin-notes/${id}`),
};
