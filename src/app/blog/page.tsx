import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest posts on SelfBlog.',
};

/**
 * Blog Listing Page
 *
 * This page will eventually use TanStack Query to fetch posts.
 * For now it renders a skeleton placeholder to demonstrate the layout.
 *
 * When ready, convert to a Client Component and use:
 *   const { data, isLoading } = usePostsQuery();
 */
export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Explore the latest posts and ideas.
        </p>
      </div>

      {/* Skeleton grid — replace with PostCard list when API is connected */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border p-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
