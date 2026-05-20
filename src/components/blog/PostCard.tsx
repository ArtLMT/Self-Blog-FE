// =============================================================================
// Components: Blog - PostCard
// =============================================================================
// Reusable card component for displaying blog post previews.
// Used in post listing pages (home, blog, admin).
// =============================================================================

import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Post } from '@/types/post.type';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Cover image */}
        {post.coverImageUrl && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Excerpt */}
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {post.author.fullName?.charAt(0)?.toUpperCase() ?? 'A'}
              </AvatarFallback>
            </Avatar>
            <span>{post.author.fullName}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            <time dateTime={post.createdAt}>{formattedDate}</time>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
