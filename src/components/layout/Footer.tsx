import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full mt-[96px] border-t border-rule">
      <div className="max-w-[720px] mx-auto px-6 py-[64px] flex flex-col items-center gap-4 text-center opacity-80 hover:opacity-100 transition-opacity duration-700">
        <p className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] font-normal text-ink-mute">
          A quiet reflective sentence.
        </p>
        <div className="flex gap-4">
          <Link
            className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] lowercase text-ink-mute hover:text-secondary transition-colors duration-500"
            href="#"
          >
            github
          </Link>
        </div>
      </div>
    </footer>
  );
}
