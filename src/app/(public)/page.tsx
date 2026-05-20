export default function HomePage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 pt-[96px] pb-[96px]">
      <header className="text-center mb-[96px] flex flex-col items-center">
        <h1 className="font-hero-title-mobile text-[48px] leading-[1.1] font-semibold md:font-hero-title md:text-[72px] md:tracking-[-0.02em] text-primary mb-6">
          Self Blog
        </h1>
        <p className="font-body-prose text-[17px] leading-[1.85] tracking-[-0.01em] font-normal text-ink-soft max-w-[480px]">
          a personal archive of unfinished thoughts, quiet transitions, and things that stayed.
        </p>
      </header>
      
      <section className="mb-[96px] text-center max-w-[540px] mx-auto">
        <p className="font-body-prose text-[17px] leading-[1.85] tracking-[-0.01em] font-normal text-on-surface-variant leading-relaxed">
          Memory is not a ledger, but a leaky vessel. We write not to preserve the past perfectly, but to leave breadcrumbs for our future selves. This space is a collection of those fragments—imperfect, quiet, and slowly settling into place.
        </p>
      </section>
      
      <div className="flex items-center justify-center gap-4 my-[64px] opacity-60">
        <div className="h-px bg-rule w-16"></div>
        <span className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] font-normal text-ink-mute uppercase tracking-widest">
          Featured
        </span>
        <div className="h-px bg-rule w-16"></div>
      </div>
      
      <article className="bg-paper-deep rounded-[18px] p-[28px] md:p-[40px] mb-[96px] cursor-pointer group hover:-translate-y-[2px] transition-all duration-700 ease-out">
        <span className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] font-normal text-ink-mute block mb-4">
          2024 · engineering
        </span>
        <h2 className="font-card-title text-[28px] leading-[1.3] font-semibold text-primary group-hover:text-secondary transition-colors duration-500 mb-4">
          First Deployment
        </h2>
        <p className="font-body-prose text-[17px] leading-[1.85] tracking-[-0.01em] font-normal text-on-surface-variant line-clamp-3">
          The terminal window sat quiet, awaiting the command that would push months of silent, localized logic into the noisy public sphere. There is a specific kind of vertigo associated with the enter key in these moments—a shift from the theoretical to the tangible.
        </p>
      </article>
      
      <div className="flex items-center justify-center gap-4 my-[64px] opacity-60">
        <div className="h-px bg-rule w-16"></div>
        <span className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] font-normal text-ink-mute uppercase tracking-widest">
          Archive
        </span>
        <div className="h-px bg-rule w-16"></div>
      </div>
      
      <div className="flex flex-col gap-6">
        <article className="bg-surface-container-low border border-rule/50 rounded-[18px] p-[28px] cursor-pointer group hover:-translate-y-[2px] hover:bg-paper-deep transition-all duration-700 ease-out flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
          <div>
            <h3 className="font-card-title text-[24px] leading-[1.3] font-semibold text-primary group-hover:text-secondary transition-colors duration-500">
              Quiet Transitions
            </h3>
          </div>
          <span className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] font-normal text-ink-mute shrink-0">
            2023 · personal
          </span>
        </article>
        
        <article className="bg-surface-container-low border border-rule/50 rounded-[18px] p-[28px] cursor-pointer group hover:-translate-y-[2px] hover:bg-paper-deep transition-all duration-700 ease-out flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
          <div>
            <h3 className="font-card-title text-[24px] leading-[1.3] font-semibold text-primary group-hover:text-secondary transition-colors duration-500">
              The Shape of Memory
            </h3>
          </div>
          <span className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] font-normal text-ink-mute shrink-0">
            2023 · design
          </span>
        </article>
        
        <div className="flex justify-center mt-[24px]">
          <button className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] font-normal lowercase text-ink-mute hover:text-secondary transition-colors duration-500 flex items-center gap-2 group">
            <span className="">load older</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-y-0.5 transition-transform duration-500">
              arrow_downward
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
