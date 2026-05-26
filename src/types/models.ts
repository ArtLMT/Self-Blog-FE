export interface PublicMarginNoteResponseDTO {
  noteContent: string;
  anchorPosition: string;
  episodeSlug: string;
}

export interface PublicEpisodeResponseDTO {
  title: string;
  slug: string;
  markdownContent: string;
  renderedContent: string;
  orderIndex: number;
  conclusion: string;
  eventDate: string; // ISO string for Instant
  chapterSlug: string;
  marginNotes: PublicMarginNoteResponseDTO[];
}

export interface PublicChapterResponseDTO {
  title: string;
  slug: string;
  quote: string;
  summary: string;
  orderIndex: number;
  readingTimeMinutes: number;
  publishedAt: string; // ISO string
  arcSlug: string;
  episodes: PublicEpisodeResponseDTO[];
}

export interface PublicArcResponseDTO {
  title: string;
  slug: string;
  summary: string;
  displayOrder: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
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
