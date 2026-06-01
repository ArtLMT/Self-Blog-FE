import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <Loader2 className="size-8 animate-spin text-primary mb-4" />
      <p className="font-body-prose text-sm text-muted-foreground italic">
        Accessing archives...
      </p>
    </div>
  );
}
