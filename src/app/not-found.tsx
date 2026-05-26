'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-mono text-[72px] font-light tracking-wide leading-none text-primary mb-4">404</h1>
        <p className="font-body-prose text-[18px] text-foreground/90 mb-6 max-w-[40ch] mx-auto">
          This entry appears to be missing from the archive, or perhaps it was never here to begin with.
        </p>
        
        <button 
          onClick={() => router.back()}
          className="small-caps text-[14px] tracking-[0.2em] text-secondary hover:text-primary px-6 py-2.5 border border-secondary/30 hover:border-primary bg-background/40 hover:bg-background/80 transition-all duration-300 rounded-md group flex items-center gap-2 mx-auto cursor-pointer shadow-sm"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
          Return to Previous
        </button>
      </div>
    </div>
  );
}
