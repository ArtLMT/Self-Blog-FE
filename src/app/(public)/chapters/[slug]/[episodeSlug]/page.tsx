import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockArcs } from '@/lib/mock-data';
import { PublicChapterResponseDTO, PublicEpisodeResponseDTO } from '@/types/models';

type PageProps = { params: Promise<{ slug: string; episodeSlug: string }> };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug, episodeSlug } = await props.params;
  let episodeTitle = 'Episode';
  for (const arc of mockArcs) {
    const chapter = arc.chapters.find(c => c.slug === slug);
    if (chapter) {
      const episode = chapter.episodes.find(e => e.slug === episodeSlug);
      if (episode) {
        episodeTitle = episode.title;
        break;
      }
    }
  }
  return { title: episodeTitle };
}

export default async function EpisodeReaderPage(props: PageProps) {
  const { slug, episodeSlug } = await props.params;

  let chapter: PublicChapterResponseDTO | undefined;
  let episode: PublicEpisodeResponseDTO | undefined;
  let arcTitle = '';

  for (const arc of mockArcs) {
    const foundChapter = arc.chapters.find(c => c.slug === slug);
    if (foundChapter) {
      chapter = foundChapter;
      arcTitle = arc.title;
      const foundEpisode = foundChapter.episodes.find(e => e.slug === episodeSlug);
      if (foundEpisode) {
        episode = foundEpisode;
      }
      break;
    }
  }

  if (!chapter || !episode) {
    notFound();
  }

  // Determine Prev/Next Episodes
  const sortedEpisodes = [...chapter.episodes].sort((a, b) => a.orderIndex - b.orderIndex);
  const currentIndex = sortedEpisodes.findIndex(e => e.slug === episodeSlug);
  
  const prevEpisode = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < sortedEpisodes.length - 1 ? sortedEpisodes[currentIndex + 1] : null;

  return (
    <article className="w-full">
      {/* Header outside the grid for full centering */}
      <header className="max-w-[720px] mx-auto px-6 pt-[96px] pb-[64px] text-center">
        <div className="small-caps text-[12px] tracking-[0.2em] text-muted-foreground mb-4">
          <Link href={`/chapters/${chapter.slug}`} className="hover:text-secondary transition-colors">
            {chapter.title}
          </Link>
          <span className="mx-2 text-[var(--color-hairline)]">/</span>
          Episode {romanize(episode.orderIndex)}
        </div>
        
        <h1 className="font-chapter-title text-[48px] leading-[1.2] font-medium text-primary mb-6">
          {episode.title}
        </h1>
      </header>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(auto,62ch)_1fr] gap-x-12 px-6 pb-[96px]">
        
        {/* Row 1: Intro paragraph */}
        <div className="col-start-1 lg:col-start-2 font-body-prose text-[18px] leading-[1.85] text-foreground/90 mb-6 lg:mb-8">
          <p className="drop-cap">
            The terminal window sat quiet, awaiting the command that would push months of silent, localized logic into the noisy public sphere. There is a specific kind of vertigo associated with the enter key in these moments—a shift from the theoretical to the tangible.
          </p>
        </div>

        {/* Row 2: Paragraph with Margin Note */}
        <div className="col-start-1 lg:col-start-2 font-body-prose text-[18px] leading-[1.85] text-foreground/90 mb-6 lg:mb-8">
          <p>
            When we build systems, we often construct them in vacuums. The local environment is perfectly controlled. Variables are known, paths are mocked, and the state is carefully curated. But deployment introduces the chaos of reality.
          </p>
        </div>
        
        {/* Margin Note for Row 2 */}
        <aside className="col-start-1 lg:col-start-3 mb-6 lg:mb-0 lg:mt-2 lg:pr-6">
          <div className="lg:pl-6 lg:border-l lg:border-[var(--color-hairline)] bg-accent/10 lg:bg-transparent p-4 lg:p-0 rounded-md lg:rounded-none text-[14px] leading-[1.6] italic font-ui-label text-muted-foreground">
            A common architectural fallacy: assuming production latency will mirror local latency. It rarely does.
          </div>
        </aside>

        {/* Row 3: Standard paragraph */}
        <div className="col-start-1 lg:col-start-2 font-body-prose text-[18px] leading-[1.85] text-foreground/90 mb-6 lg:mb-8">
          <p>
            Memory is similarly volatile. We write not to preserve the past perfectly, but to leave breadcrumbs for our future selves. This space is a collection of those fragments—imperfect, quiet, and slowly settling into place. As I pushed the commit, I wondered which of these digital breadcrumbs would survive the next refactor.
          </p>
        </div>

      </div>

      {/* Footer Navigation */}
      <footer className="max-w-[720px] mx-auto px-6 pb-[96px]">
        <div className="h-px w-full bg-[var(--color-hairline)] mb-12"></div>
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8">
          
          <div className="flex-1 text-center sm:text-left">
            {prevEpisode && (
              <Link href={`/chapters/${chapter.slug}/${prevEpisode.slug}`} className="group block">
                <div className="small-caps text-[11px] tracking-[0.2em] text-muted-foreground mb-2 group-hover:text-secondary transition-colors">
                  Previous Episode
                </div>
                <div className="font-chapter-title text-[24px] italic text-primary group-hover:text-secondary transition-colors">
                  {prevEpisode.title}
                </div>
              </Link>
            )}
          </div>

          <div className="flex-1 text-center sm:text-right">
            {nextEpisode ? (
              <Link href={`/chapters/${chapter.slug}/${nextEpisode.slug}`} className="group block">
                <div className="small-caps text-[11px] tracking-[0.2em] text-muted-foreground mb-2 group-hover:text-secondary transition-colors">
                  Next Episode
                </div>
                <div className="font-chapter-title text-[24px] italic text-primary group-hover:text-secondary transition-colors">
                  {nextEpisode.title}
                </div>
              </Link>
            ) : (
              <Link href={`/chapters/${chapter.slug}`} className="group block">
                <div className="small-caps text-[11px] tracking-[0.2em] text-muted-foreground mb-2 group-hover:text-secondary transition-colors">
                  Return to Index
                </div>
                <div className="font-chapter-title text-[24px] italic text-primary group-hover:text-secondary transition-colors">
                  {chapter.title}
                </div>
              </Link>
            )}
          </div>
          
        </div>
      </footer>
    </article>
  );
}

function romanize(num: number): string {
  if (isNaN(num)) return NaN.toString();
  var digits = String(+num).split(""),
      key = ["","I","II","III","IV","V","VI","VII","VIII","IX",
             "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
             "","C","CC","CCC","CD","D","DC","DCC","DCCC","CM"],
      roman = "",
      i = 3;
  while (i--)
      // @ts-ignore
      roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(new Array(num + 1).join("M")).join("") + roman;
}
