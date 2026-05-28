import type { Metadata } from 'next';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your SelfBlog account.',
};

/**
 * LoginPage Component
 * 
 * Renders the login page within the public layout.
 * Designed to fit borderlessly in the main content flow, styled with a
 * centered editorial header and an embedded LoginForm.
 */
export default function LoginPage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 pt-[120px] pb-[120px]">
      <header className="mb-[64px] text-center flex flex-col items-center">
        <h1 className="font-chapter-title text-[72px] sm:text-[96px] leading-[1] font-medium text-primary mb-6 tracking-tight animate-in fade-in slide-in-from-bottom duration-700">
          Access.
        </h1>
        <p className="font-body-prose text-[18px] leading-[1.6] text-muted-foreground max-w-[40ch]">
          Sign in to the archival dashboard to write, edit, and manage entries.
        </p>
      </header>
      
      <LoginForm />
    </main>
  );
}
