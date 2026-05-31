import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { apiFetch } from '@/lib/api-server';
import type { PublicChapterResponseDTO, PublicEpisodeResponseDTO } from '@/types/models';

type PageProps = { params: Promise<{ slug: string; episodeSlug: string }> };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { episodeSlug } = await props.params;
  try {
    const res = await apiFetch<PublicEpisodeResponseDTO>(`/public/episodes/${episodeSlug}`);
    if (res.data) {
      return { title: res.data.title };
    }
  } catch (err) {
    console.error('Error generating metadata for episode:', err);
  }
  return { title: 'Episode' };
}

function formatDateUTC(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function EpisodeReaderPage(props: PageProps) {
  const { slug, episodeSlug } = await props.params;

  let chapter: PublicChapterResponseDTO | undefined;
  let episode: PublicEpisodeResponseDTO | undefined;

  try {
    const [chapterRes, episodeRes] = await Promise.all([
      apiFetch<PublicChapterResponseDTO>(`/public/chapters/${slug}`),
      apiFetch<PublicEpisodeResponseDTO>(`/public/episodes/${episodeSlug}`),
    ]);
    chapter = chapterRes.data;
    episode = episodeRes.data;
  } catch (err) {
    console.error('Error loading episode reader data:', err);
  }

  if (!chapter || !episode) {
    notFound();
  }

  // Determine Prev/Next Episodes
  const sortedEpisodes = [...(chapter.episodes || [])].sort((a, b) => a.orderIndex - b.orderIndex);
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

        {episode.eventDate && (
          <div className="small-caps text-[10px] text-muted-foreground tracking-[0.15em]">
            Event Date: {formatDateUTC(episode.eventDate)}
          </div>
        )}
      </header>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(auto,62ch)_1fr] gap-x-12 px-6 pb-12">
        <div className="episode-content col-start-1 lg:col-start-2 font-body-prose text-[18px] leading-[1.85] text-foreground/90 mb-6 lg:mb-8 max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="font-chapter-title text-[36px] mt-10 mb-4 text-primary font-medium">{children}</h1>,
              h2: ({ children }) => <h2 className="font-chapter-title text-[30px] mt-8 mb-3 text-primary font-medium">{children}</h2>,
              h3: ({ children }) => <h3 className="font-chapter-title text-[24px] mt-6 mb-2 text-primary font-medium">{children}</h3>,
              h4: ({ children }) => <h4 className="font-chapter-title text-[20px] mt-4 mb-2 text-primary font-medium">{children}</h4>,
              p: ({ children }) => <p className="mb-6">{children}</p>,
              a: ({ href, children }) => (
                <a href={href} className="text-secondary hover:text-primary underline underline-offset-4 decoration-1 transition-colors duration-200">
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-3 border-[var(--color-sienna-mid)] pl-6 my-6 italic text-muted-foreground/90 font-pull-quote text-[22px] leading-[1.6]">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="pl-1">{children}</li>,
              pre: ({ children }) => <pre className="bg-accent/10 border border-[var(--color-hairline)] p-4 rounded-md overflow-x-auto my-6 font-metadata text-[15px] leading-[1.6]">{children}</pre>,
              code: ({ children }) => <code className="bg-accent/10 px-1.5 py-0.5 rounded border border-[var(--color-hairline)] font-metadata text-[15px] text-secondary">{children}</code>,
              img: ({ src, alt }) => (
                <span className="block my-8 max-w-full overflow-hidden rounded-md border border-[var(--color-hairline)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} className="w-full h-auto object-cover" />
                </span>
              ),
            }}
          >
            {episode.markdownContent || ''}
          </ReactMarkdown>
        </div>
        
        {episode.marginNotes && episode.marginNotes.length > 0 && (
          <aside className="col-start-1 lg:col-start-3 space-y-6 lg:pr-6">
            {episode.marginNotes.map((note, index) => (
              <div key={index} className="lg:pl-6 lg:border-l lg:border-[var(--color-hairline)] bg-accent/10 lg:bg-transparent p-4 lg:p-0 rounded-md lg:rounded-none text-[14px] leading-[1.6] italic font-ui-label text-muted-foreground">
                {note.noteContent}
              </div>
            ))}
          </aside>
        )}
      </div>

      {/* Episode Conclusion */}
      {episode.conclusion && (
        <div className="max-w-[720px] mx-auto px-6 pb-12 text-center">
          <p className="font-pull-quote text-[18px] leading-[1.6] italic text-muted-foreground">
            {episode.conclusion}
          </p>
        </div>
      )}

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
