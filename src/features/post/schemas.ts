import { z } from 'zod';
import { ContentStatus, Language, Visibility } from '@/types/models';

const languageSchema = z.enum(['EN', 'VI'] as const);
const statusSchema = z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED'] as const);
const visibilitySchema = z.enum(['PUBLIC', 'PRIVATE'] as const);

export const arcSchema = z.object({
  language: languageSchema,
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255),
  summary: z.string().max(1000).optional(),
  displayOrder: z.number().int(),
  startDate: z.string().min(1, 'Start date is required'), // Assuming ISO-8601 string
  endDate: z.string().optional(),
  visibility: visibilitySchema,
  status: statusSchema,
  notes: z.string().optional(),
});

export type ArcFormValues = z.infer<typeof arcSchema>;

export const chapterSchema = z.object({
  language: languageSchema,
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255),
  content: z.string().optional(),
  displayOrder: z.number().int(),
  status: statusSchema,
  publishDate: z.string().optional(), // ISO-8601 string
  authorNotes: z.string().optional(),
  arcId: z.string(),
});

export type ChapterFormValues = z.infer<typeof chapterSchema>;

export const episodeSchema = z.object({
  language: languageSchema,
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255),
  content: z.string().min(1, 'Content is required'),
  displayOrder: z.number().int(),
  status: statusSchema,
  publishDate: z.string().optional(),
  authorNotes: z.string().optional(),
  chapterId: z.string(),
});

export type EpisodeFormValues = z.infer<typeof episodeSchema>;
