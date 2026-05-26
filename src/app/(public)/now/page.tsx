import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Now',
  description: 'What I am doing now.',
};

export default function NowPage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 pt-[120px] pb-[120px]">
      <header className="mb-[96px]">
        {/* Stark, immediate layout with an oversized serif title */}
        <h1 className="font-chapter-title text-[72px] sm:text-[96px] leading-[1] font-medium text-primary mb-6 tracking-tight">
          Now.
        </h1>
        <p className="font-body-prose text-[20px] leading-[1.6] text-muted-foreground italic">
          Updated May 23, 2026
        </p>
      </header>

      <div className="space-y-16">
        <section>
          <h2 className="small-caps text-[14px] tracking-[0.2em] text-secondary mb-6">
            Reading
          </h2>
          <ul className="space-y-4 font-body-prose text-[18px] leading-[1.85] text-foreground/90">
            <li>
              <span className="font-medium text-primary">The Timeless Way of Building</span> by Christopher Alexander
            </li>
            <li>
              <span className="font-medium text-primary">A Memory Called Empire</span> by Arkady Martine
            </li>
          </ul>
        </section>

        <section>
          <h2 className="small-caps text-[14px] tracking-[0.2em] text-secondary mb-6">
            Building
          </h2>
          <div className="font-body-prose text-[18px] leading-[1.85] text-foreground/90 space-y-4">
            <p>
              I am currently rebuilding this digital garden, moving away from a traditional blog format toward an archival structure organized by Arcs and Chapters. 
            </p>
            <p>
              The focus is on creating a space that feels like a quiet, physical journal—relying on subtle transitions, okLCH color spaces for perceptual uniformity, and structural typography.
            </p>
          </div>
        </section>

        <section>
          <h2 className="small-caps text-[14px] tracking-[0.2em] text-secondary mb-6">
            Thinking About
          </h2>
          <div className="font-body-prose text-[18px] leading-[1.85] text-foreground/90 space-y-4">
            <p>
              How memory is fundamentally lossy, and how digital systems—which default to perfect retention—often fail to capture the degradation that gives human memory its shape.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
