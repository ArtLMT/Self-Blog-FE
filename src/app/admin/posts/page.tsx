import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Posts',
  description: 'Create, edit, and manage your blog posts.',
};

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts.</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Post management table will appear here once the API is connected.
            Use TanStack Query&apos;s <code>usePostsQuery()</code> hook to fetch data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
