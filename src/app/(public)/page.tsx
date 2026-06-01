import type { Metadata } from 'next';
import Link from 'next/link';
import { apiFetch } from '@/lib/api-server';
import type { PublicArcResponseDTO } from '@/types/models';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home',
  description: 'A personal archive of unfinished thoughts.',
};

async function ArcsList() {
  let arcs: PublicArcResponseDTO[] = [];
  try {
    const response = await apiFetch<PublicArcResponseDTO[]>('/public/arcs');
    arcs = response.data ?? [];
  } catch (err) {
    console.error('Failed to load arcs:', err);
  }

  return (
    <section className="flex flex-col gap-6 max-w-[58ch] mx-auto">
      {arcs.map((arc) => {
        const isActive = arc.chapters && arc.chapters.length > 0;
        
        if (isActive) {
          return (
            <Link 
              key={arc.slug} 
              href={`/timeline`} 
              className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--color-hairline)] pb-4 transition-all duration-500 ease-out text-left"
            >
              <div>
                <h3 className="font-chapter-title text-[28px] leading-[1.3] text-foreground group-hover:text-primary transition-colors duration-500">
                  {arc.title}
                </h3>
                <p className="font-body-prose text-[15px] text-muted-foreground mt-1 line-clamp-2">
                  {arc.summary}
                </p>
              </div>
              <span className="small-caps text-[11px] tracking-[0.05em] text-muted-foreground shrink-0 mt-2 sm:mt-0">
                {new Date(arc.startDate).getFullYear()}
              </span>
            </Link>
          );
        }
        
        // Disabled/Empty Arc
        return (
          <div key={arc.slug} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--color-hairline)] pb-4 opacity-60 text-left">
            <div>
              <h3 className="font-chapter-title text-[28px] leading-[1.3] text-foreground">
                {arc.title}
              </h3>
              <p className="font-body-prose text-[15px] text-muted-foreground mt-1 line-clamp-2">
                {arc.summary}
              </p>
            </div>
            <span className="small-caps text-[11px] tracking-[0.05em] text-muted-foreground shrink-0 mt-2 sm:mt-0">
              {new Date(arc.startDate).getFullYear()}
            </span>
          </div>
        );
      })}
    </section>
  );
}

export default function HomePage() {

  return (
    <main className="max-w-[720px] mx-auto px-6 pt-[96px] pb-[96px]">
      {/* Centered Hero */}
      <header className="text-center mb-[96px] flex flex-col items-center">
        <h1 className="font-chapter-title text-[72px] leading-[1.1] font-medium text-primary mb-6">
          Self Blog
        </h1>
        <div className="font-body-prose text-[17px] leading-[1.85] text-foreground/90 max-w-[58ch] space-y-6">
          <p>
            Memory is not a ledger, but a leaky vessel. We write not to preserve the past perfectly, but to leave breadcrumbs for our future selves.
          </p>
          <p>
            This space is a collection of those fragments—imperfect, quiet, and slowly settling into place.
          </p>
        </div>
      </header>
      
      {/* Foreword Divider */}
      <div className="flex items-center justify-center gap-4 my-[64px]">
        <div className="h-px bg-[var(--color-hairline)] w-16"></div>
        <span className="small-caps text-[12px] tracking-[0.2em] text-secondary text-center shrink-0">
          The Arcs
        </span>
        <div className="h-px bg-[var(--color-hairline)] w-16"></div>
      </div>
      
      <Suspense fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="size-6 animate-spin text-primary/50" />
        </div>
      }>
        <ArcsList />
      </Suspense>
    </main>
  );
}
