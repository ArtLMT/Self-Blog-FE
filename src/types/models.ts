// =============================================================================
// Types: Domain Entities and DTOs (Public & Admin)
// =============================================================================

export type Language = 'EN' | 'VI';
export type ContentStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
export type Visibility = 'PUBLIC' | 'PRIVATE';

// ---------------------------------------------------------------------------
// Public Domain Entities & DTOs
// ---------------------------------------------------------------------------

export interface PublicMarginNoteResponseDTO {
  language?: Language;
  noteContent: string;
  anchorPosition: string;
  episodeSlug: string;
}

export interface PublicEpisodeResponseDTO {
  language?: Language;
  title: string;
  slug: string;
  markdownContent: string;
  orderIndex: number;
  conclusion?: string;
  eventDate: string; // ISO string for Instant
  chapterSlug: string;
  marginNotes: PublicMarginNoteResponseDTO[];
}

export interface PublicChapterResponseDTO {
  language?: Language;
  title: string;
  slug: string;
  quote?: string;
  summary?: string;
  orderIndex: number;
  readingTimeMinutes?: number;
  publishedAt: string; // ISO string
  arcSlug: string;
  episodes: PublicEpisodeResponseDTO[];
}

export interface PublicArcResponseDTO {
  language?: Language;
  title: string;
  slug: string;
  summary?: string;
  displayOrder: number;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  chapters: PublicChapterResponseDTO[];
}

export interface TimelineItemDTO {
  arcTitle: string;
  arcSlug: string;
  arcDisplayOrder: number;
  chapterTitle: string;
  chapterSlug: string;
  chapterOrderIndex: number;
  episodeTitle: string;
  episodeSlug: string;
  episodeOrderIndex: number;
}

// ---------------------------------------------------------------------------
// Admin Domain Entities & DTOs (Editorial Management)
// ---------------------------------------------------------------------------

export interface ArcRequestDTO {
  language: Language;
  title: string;
  slug: string;
  summary?: string;
  displayOrder: number;
  startDate: string; // ISO Instant
  endDate?: string; // ISO Instant
  visibility: Visibility;
  status: ContentStatus;
  notes?: string;
}

export interface AdminArcResponseDTO {
  id: string; // UUID
  language: Language;
  title: string;
  slug: string;
  summary?: string;
  displayOrder: number;
  startDate: string;
  endDate?: string;
  visibility: Visibility;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  chapters: AdminChapterResponseDTO[];
}

export interface ChapterRequestDTO {
  language: Language;
  title: string;
  slug: string;
  summary?: string;
  orderIndex: number;
  status: ContentStatus;
  publishedAt?: string; // ISO Instant
  authorNotes?: string;
  arcId: string;
}

export interface AdminChapterResponseDTO {
  id: string;
  language: Language;
  arcId: string;
  title: string;
  slug: string;
  quote?: string;
  summary?: string;
  orderIndex: number;
  status: ContentStatus;
  readingTimeMinutes?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  episodes: AdminEpisodeResponseDTO[];
}

export interface EpisodeRequestDTO {
  language: Language;
  title: string;
  slug: string;
  markdownContent: string;
  orderIndex: number;
  status: ContentStatus;
  eventDate: string; // ISO Instant
  authorNotes?: string;
  chapterId: string;
}

export interface AdminEpisodeResponseDTO {
  id: string;
  language: Language;
  chapterId: string;
  title: string;
  slug: string;
  content: string;
  orderIndex: number;
  conclusion?: string;
  eventDate: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  marginNotes: AdminMarginNoteResponseDTO[];
}

export interface MarginNoteRequestDTO {
  language: Language;
  episodeId: string; // UUID
  noteContent: string;
  anchorPosition: string; // CSS selector or text anchor
  visibility: Visibility;
}

export interface AdminMarginNoteResponseDTO {
  id: string;
  language: Language;
  episodeId: string;
  noteContent: string;
  anchorPosition: string;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
