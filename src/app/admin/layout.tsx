import { Sidebar } from '@/components/layout/Sidebar';

/**
 * Admin Layout
 *
 * Protected area with sidebar navigation.
 * The middleware.ts file handles authentication checks
 * before this layout even renders.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-muted/20 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
