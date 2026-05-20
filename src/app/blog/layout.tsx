import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

/**
 * Blog Layout
 *
 * Shares the same Navbar + Footer as public pages.
 * Separated from the (public) route group so it can have
 * its own layout customizations in the future (e.g., reading mode).
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
