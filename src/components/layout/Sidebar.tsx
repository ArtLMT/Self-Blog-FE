// =============================================================================
// Components: Layout - Sidebar (Admin)
// =============================================================================
// Admin sidebar navigation used in the admin dashboard layout.
// =============================================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, Users, ArrowLeft, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

const sidebarLinks = [
  {
    href: ROUTES.ADMIN.WORKSPACE,
    label: 'Workspace',
    icon: BookOpen,
  },
  {
    href: ROUTES.ADMIN.POSTS,
    label: 'Posts',
    icon: FileText,
  },
  {
    href: ROUTES.ADMIN.USERS,
    label: 'Users',
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout().then(() => {
      window.location.href = ROUTES.HOME;
    });
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border/40 bg-muted/20">
      {/* Back to site link */}
      <div className="border-b border-border/40 p-4">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to site
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1 p-3">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer section with Logout */}
      <div className="border-t border-border/40 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive cursor-pointer"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
