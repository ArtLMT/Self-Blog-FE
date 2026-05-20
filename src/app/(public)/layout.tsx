import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

/**
 * Public Layout
 *
 * Route group "(public)" doesn't affect the URL path.
 * It provides shared layout (Navbar + Footer) for all public pages:
 * - Home (/)
 * - Login (/login)
 * - Register (/register)
 *
 * Admin pages use a different layout with a sidebar instead.
 */
export default function PublicLayout({
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
