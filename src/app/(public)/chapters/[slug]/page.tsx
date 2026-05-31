import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api-server';
import type { PublicChapterResponseDTO, PublicArcResponseDTO } from '@/types/models';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const res = await apiFetch<PublicChapterResponseDTO>(`/public/chapters/${slug}`);
    if (res.data) {
      return { title: res.data.title };
    }
  } catch (err) {
    console.error('Error generating metadata for chapter:', err);
  }
  return { title: 'Chapter' };
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

export default async function ChapterGatewayPage(props: PageProps) {
  const { slug } = await props.params;

  let chapter: PublicChapterResponseDTO | undefined;
  let arcTitle = '';

  try {
    const res = await apiFetch<PublicChapterResponseDTO>(`/public/chapters/${slug}`);
    chapter = res.data;
  } catch (err) {
    console.error('Error loading chapter details:', err);
  }

  if (!chapter) {
    notFound();
  }

  try {
    const arcsRes = await apiFetch<PublicArcResponseDTO[]>('/public/arcs');
    const parentArc = arcsRes.data?.find((a) => a.slug === chapter?.arcSlug);
    if (parentArc) {
      arcTitle = parentArc.title;
    }
  } catch (err) {
    console.error('Error loading parent arc for chapter details:', err);
  }

  const sortedEpisodes = [...(chapter.episodes || [])].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <article className="flex-grow w-full max-w-[720px] mx-auto px-6 pt-[96px] pb-[96px]">
      {/* Chapter Header */}
      <header className="text-center mb-[64px]">
        {arcTitle && (
          <div className="small-caps text-[12px] tracking-[0.2em] text-muted-foreground mb-4">
            Arc: {arcTitle}
          </div>
        )}
        
        <h1 className="font-chapter-title text-[56px] leading-[1.2] font-medium text-primary mb-6">
          {chapter.title}
        </h1>
        
        <div className="small-caps text-[12px] tracking-[0.2em] text-muted-foreground flex items-center justify-center gap-3">
          <span>{formatDateUTC(chapter.publishedAt)}</span>
          {chapter.readingTimeMinutes !== undefined && (
            <>
              <span className="text-[var(--color-hairline)]">|</span>
              <span>{chapter.readingTimeMinutes} min read</span>
            </>
          )}
        </div>
      </header>

      {/* Chapter Quote */}
      {chapter.quote && (
        <div className="my-[64px] py-[40px] px-8 border-l border-[var(--color-hairline)] flex flex-col items-center text-center">
          <p className="font-pull-quote text-[20px] leading-[1.6] font-normal text-secondary italic">
            {chapter.quote}
          </p>
        </div>
      )}

      {/* Chapter Summary */}
      {chapter.summary && (
        <div className="font-body-prose text-[17px] leading-[1.85] text-foreground/90 space-y-6 max-w-[62ch] mx-auto mb-[96px]">
          <p className="drop-cap">{chapter.summary}</p>
        </div>
      )}

      {/* Episode Directory */}
      <div className="max-w-[500px] mx-auto">
        <div className="small-caps text-[14px] tracking-[0.2em] text-primary mb-6 text-center">Directory</div>
        
        <div className="border-t border-b border-[var(--color-hairline)] py-6 space-y-4">
          {sortedEpisodes.map((episode) => (
            <div key={episode.slug} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 group">
              <span className="small-caps text-[11px] text-muted-foreground text-right mt-1">
                {romanize(episode.orderIndex)}.
              </span>
              
              <Link 
                href={`/chapters/${chapter.slug}/${episode.slug}`}
                className="font-ui-label text-[16px] text-foreground hover:text-secondary transition-colors link-underline w-fit"
              >
                {episode.title}
              </Link>
              
              <span className="small-caps text-[10px] text-muted-foreground whitespace-nowrap opacity-60">
                5 min read
              </span>
            </div>
          ))}
          
          {sortedEpisodes.length === 0 && (
            <div className="text-center text-muted-foreground small-caps text-[11px] py-4">
              No episodes published yet
            </div>
          )}
        </div>
      </div>
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
