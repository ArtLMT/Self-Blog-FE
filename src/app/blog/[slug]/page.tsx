import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

/**
 * Blog Detail Page (Dynamic Route)
 *
 * In Next.js 16, params is a Promise that must be awaited.
 * This page demonstrates the pattern for dynamic segments.
 *
 * When the API is connected, fetch the actual post data here using
 * the slug parameter and postService.getBySlug(slug).
 */
export async function generateMetadata(
  props: PageProps<'/blog/[slug]'>
): Promise<Metadata> {
  const { slug } = await props.params;
  // TODO: Fetch post data to generate dynamic metadata
  return {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Read "${slug}" on SelfBlog.`,
  };
}

export default async function BlogDetailPage(
  props: PageProps<'/blog/[slug]'>
) {
  const { slug } = await props.params;

  // TODO: Replace with actual API call:
  // const post = await postService.getBySlug(slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeft className="mr-2 size-4" />
          Back to Blog
        </Link>
      </Button>

      {/* Header */}
      <header className="mb-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary">Technology</Badge>
          <Badge variant="secondary">Next.js</Badge>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                A
              </AvatarFallback>
            </Avatar>
            <span>Author Name</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1">
            <CalendarDays className="size-4" />
            <span>May 18, 2026</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>5 min read</span>
          </div>
        </div>
      </header>

      <Separator className="mb-8" />

      {/* Content placeholder */}
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          This is a placeholder for the blog post content. When the backend API
          is connected, this will render the actual post content using the slug
          &quot;<strong>{slug}</strong>&quot; to fetch the data.
        </p>
        <p>
          The content will be rendered as HTML or Markdown depending on your
          backend&apos;s content format. Consider using a Markdown renderer like
          <code>react-markdown</code> or <code>next-mdx-remote</code>.
        </p>
      </div>
    </article>
  );
}
