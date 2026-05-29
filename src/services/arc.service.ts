// =============================================================================
// Services: Arc Service
// =============================================================================
// Handles public and administrative API interactions for Arcs.
// =============================================================================

import apiClient from '@/services/axios';
import type { ApiResponse } from '@/types/auth.type';
import type {
  PublicArcResponseDTO,
  TimelineItemDTO,
  AdminArcResponseDTO,
  ArcRequestDTO,
} from '@/types/models';

export const arcService = {
  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /** Fetch all published public arcs */
  getPublicArcs: () =>
    apiClient.get<ApiResponse<PublicArcResponseDTO[]>>('/public/arcs'),

  /** Fetch a single published arc by its slug */
  getPublicArcBySlug: (slug: string) =>
    apiClient.get<ApiResponse<PublicArcResponseDTO>>(`/public/arcs/${slug}`),

  /** Fetch the full content timeline */
  getTimeline: () =>
    apiClient.get<ApiResponse<TimelineItemDTO[]>>('/public/arcs/timeline'),

  // ---------------------------------------------------------------------------
  // Admin API (Requires Editorial Access)
  // ---------------------------------------------------------------------------

  /** Fetch all arcs (any status/visibility) for management */
  getAdminArcs: () =>
    apiClient.get<ApiResponse<AdminArcResponseDTO[]>>('/admin/arcs'),

  /** Fetch a single arc by UUID */
  getAdminArcById: (id: string) =>
    apiClient.get<ApiResponse<AdminArcResponseDTO>>(`/admin/arcs/${id}`),

  /** Create a new arc */
  createArc: (data: ArcRequestDTO) =>
    apiClient.post<ApiResponse<AdminArcResponseDTO>>('/admin/arcs', data),

  /** Update an existing arc */
  updateArc: (id: string, data: ArcRequestDTO) =>
    apiClient.put<ApiResponse<AdminArcResponseDTO>>(`/admin/arcs/${id}`, data),

  /** Soft-delete an arc */
  deleteArc: (id: string) =>
    apiClient.delete<ApiResponse<unknown>>(`/admin/arcs/${id}`),
};
