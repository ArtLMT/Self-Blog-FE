import type { Metadata } from 'next';
import Link from 'next/link';
import { apiFetch } from '@/lib/api-server';
import type { PublicArcResponseDTO } from '@/types/models';

export const metadata: Metadata = {
  title: 'Chapters',
  description: 'An index of all chapters.',
};

export default async function ChaptersIndexPage() {
  let arcs: PublicArcResponseDTO[] = [];
  try {
    const response = await apiFetch<PublicArcResponseDTO[]>('/public/arcs');
    arcs = response.data ?? [];
  } catch (err) {
    console.error('Failed to load arcs for index:', err);
  }

  const activeArcs = arcs.filter(arc => arc.chapters && arc.chapters.length > 0);

  return (
    <main className="max-w-[720px] mx-auto px-6 pt-[96px] pb-[96px]">
      <header className="text-center mb-[96px]">
        <h1 className="font-chapter-title text-[48px] leading-[1.1] font-medium text-primary mb-6">
          Index
        </h1>
        <p className="font-body-prose text-[17px] leading-[1.85] text-muted-foreground max-w-[58ch] mx-auto">
          A quiet ledger of entries, sorted by their respective arcs.
        </p>
      </header>

      <div className="space-y-[96px] text-center">
        {activeArcs.map((arc) => (
          <section key={arc.slug}>
            {/* Arc Header */}
            <div className="small-caps text-[14px] tracking-[0.2em] text-secondary mb-8">
              {arc.title}
            </div>

            {/* Chapters List */}
            <div className="flex flex-col items-center gap-6">
              {arc.chapters
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((chapter) => (
                  <Link 
                    key={chapter.slug}
                    href={`/chapters/${chapter.slug}`}
                    className="group inline-block text-center"
                  >
                    <h3 className="font-chapter-title text-[24px] text-foreground group-hover:text-primary transition-colors duration-500">
                      {chapter.title}
                    </h3>
                    <div className="small-caps text-[11px] tracking-[0.05em] text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      Chapter {chapter.orderIndex} · {chapter.readingTimeMinutes} min read
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
