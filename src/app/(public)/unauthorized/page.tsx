import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6 max-w-[540px] mx-auto animate-in fade-in duration-700">
      <h1 className="font-chapter-title text-[36px] font-medium text-primary mb-4 tracking-tight">
        Restricted Archive
      </h1>
      <p className="font-body-prose text-[17px] leading-[1.8] text-muted-foreground italic mb-8">
        &quot;This workspace belongs to the archivist.&quot;<br />The public pages remain open for reading.
      </p>
      <Link 
        href={ROUTES.HOME} 
        className="small-caps text-[12px] tracking-[0.2em] text-foreground hover:text-primary transition-colors duration-300 border-b border-foreground/30 hover:border-primary pb-0.5"
      >
        Return Home
      </Link>
    </div>
  );
}
