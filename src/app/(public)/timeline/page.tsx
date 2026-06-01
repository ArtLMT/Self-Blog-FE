import type { Metadata } from 'next';
import Link from 'next/link';
import { apiFetch } from '@/lib/api-server';
import type { TimelineItemDTO, PublicArcResponseDTO } from '@/types/models';

export const metadata: Metadata = {
  title: 'Timeline',
  description: 'The complete timeline of Arcs, Chapters, and Episodes.',
};

export default async function TimelinePage() {
  let timelineItems: TimelineItemDTO[] = [];
  let arcs: PublicArcResponseDTO[] = [];

  try {
    const [timelineRes, arcsRes] = await Promise.all([
      apiFetch<TimelineItemDTO[]>('/public/arcs/timeline'),
      apiFetch<PublicArcResponseDTO[]>('/public/arcs'),
    ]);
    timelineItems = timelineRes.data ?? [];
    arcs = arcsRes.data ?? [];
  } catch (err) {
    console.error('Failed to load timeline data:', err);
  }

  // Map arc slugs to their start dates and summaries
  const arcSlugToYear: Record<string, string> = {};
  const arcSlugToSummary: Record<string, string> = {};
  arcs.forEach((arc) => {
    const year = new Date(arc.startDate).getFullYear().toString();
    arcSlugToYear[arc.slug] = year;
    arcSlugToSummary[arc.slug] = arc.summary || '';
  });

  // Reconstruct hierarchy: Year -> Arc -> Chapter -> Episode
  interface TimelineEpisode {
    title: string;
    slug: string;
    orderIndex: number;
  }
  interface TimelineChapter {
    title: string;
    slug: string;
    orderIndex: number;
    episodes: TimelineEpisode[];
  }
  interface TimelineArc {
    title: string;
    slug: string;
    summary: string;
    displayOrder: number;
    chapters: Record<string, TimelineChapter>;
  }

  const hierarchy: Record<string, Record<string, TimelineArc>> = {};

  timelineItems.forEach((item) => {
    const year = arcSlugToYear[item.arcSlug] || 'Unknown';
    const summary = arcSlugToSummary[item.arcSlug] || '';

    if (!hierarchy[year]) hierarchy[year] = {};
    if (!hierarchy[year][item.arcSlug]) {
      hierarchy[year][item.arcSlug] = {
        title: item.arcTitle,
        slug: item.arcSlug,
        summary,
        displayOrder: item.arcDisplayOrder,
        chapters: {},
      };
    }

    const arcObj = hierarchy[year][item.arcSlug];
    if (item.chapterSlug) {
      if (!arcObj.chapters[item.chapterSlug]) {
        arcObj.chapters[item.chapterSlug] = {
          title: item.chapterTitle,
          slug: item.chapterSlug,
          orderIndex: item.chapterOrderIndex,
          episodes: [],
        };
      }

      const chapterObj = arcObj.chapters[item.chapterSlug];
      if (item.episodeSlug) {
        if (!chapterObj.episodes.some((e) => e.slug === item.episodeSlug)) {
          chapterObj.episodes.push({
            title: item.episodeTitle,
            slug: item.episodeSlug,
            orderIndex: item.episodeOrderIndex,
          });
        }
      }
    }
  });

  // Sort years oldest first
  const sortedYears = Object.keys(hierarchy).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="max-w-[720px] mx-auto px-6 py-[96px]">
      <header className="mb-24 text-center">
        <h1 className="font-chapter-title text-[56px] leading-[1.2] font-medium text-primary mb-6">Timeline</h1>
        <p className="font-body-prose text-[17px] leading-[1.85] text-muted-foreground max-w-[58ch] mx-auto">
          The continuous trace of where we were and what we built.
        </p>
      </header>

      {/* Timeline Layout Container */}
      <div className="relative pl-[80px] sm:pl-[140px]">
        {/* The Vertical Spine */}
        <div className="absolute left-[60px] sm:left-[100px] top-4 bottom-0 w-px bg-accent/40"></div>

        <div className="space-y-32">
          {sortedYears.map((year) => (
            <div key={year} className="relative">
              {/* Year Node */}
              <div className="absolute -left-[80px] sm:-left-[140px] top-0 w-[60px] sm:w-[100px] flex items-center justify-end pr-6">
                <span className="font-chapter-title text-4xl text-primary">{year}</span>
                <div className="absolute -right-[5.5px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full bg-primary ring-4 ring-background z-10"></div>
              </div>

              <div className="space-y-24 mt-2">
                {Object.values(hierarchy[year])
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((arc) => (
                    <div key={arc.slug} className="relative">
                      {/* Arc Node */}
                      <div className="absolute -left-[23.5px] sm:-left-[43.5px] top-[14px] w-2 h-2 rounded-full bg-secondary z-10 ring-2 ring-background"></div>

                      <div className="mb-8">
                        <h2 className="font-chapter-title text-[32px] text-foreground mb-2">{arc.title}</h2>
                        {arc.summary && <p className="font-body-prose text-[17px] text-muted-foreground">{arc.summary}</p>}
                      </div>

                      {/* Chapters List */}
                      <div className="ml-2 sm:ml-4 pl-6 border-l border-[var(--color-hairline)] space-y-12">
                        {Object.values(arc.chapters)
                          .sort((a, b) => a.orderIndex - b.orderIndex)
                          .map((chapter) => (
                            <div key={chapter.slug}>
                              <div className="mb-5">
                                <Link 
                                  href={`/chapters/${chapter.slug}`} 
                                  className="font-chapter-title text-[24px] text-foreground hover:text-secondary transition-colors link-underline inline-block mb-1"
                                >
                                  Chapter {chapter.orderIndex}: {chapter.title}
                                </Link>
                              </div>

                              {/* Episodes List */}
                              <div className="ml-2 pl-4 border-l border-[var(--color-hairline)] space-y-4">
                                {chapter.episodes
                                  .sort((a, b) => a.orderIndex - b.orderIndex)
                                  .map((episode) => (
                                    <div key={episode.slug} className="flex items-start gap-4">
                                      <span className="small-caps text-[11px] text-muted-foreground w-6 mt-1 text-right">{romanize(episode.orderIndex)}.</span>
                                      <Link 
                                        href={`/chapters/${chapter.slug}/${episode.slug}`}
                                        className="font-ui-label text-[15px] text-foreground/90 leading-relaxed hover:text-secondary transition-colors link-underline"
                                      >
                                        {episode.title}
                                      </Link>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function romanize(num: number): string {
  if (isNaN(num)) return NaN.toString();
  const digits = String(+num).split(""),
        key = ["","I","II","III","IV","V","VI","VII","VIII","IX",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","C","CC","CCC","CD","D","DC","DCC","DCCC","CM"];
  let roman = "",
      i = 3;
  while (i--) {
      const popValue = digits.pop();
      if (popValue !== undefined) {
        roman = (key[+popValue + (i * 10)] || "") + roman;
      }
  }
  return Array(new Array(num + 1).join("M")).join("") + roman;
}
