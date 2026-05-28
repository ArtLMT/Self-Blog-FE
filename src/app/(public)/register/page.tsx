import type { Metadata } from 'next';
import { RegisterForm } from '@/components/forms/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new SelfBlog account to start blogging.',
};

/**
 * RegisterPage Component
 * 
 * Renders the registration page within the public layout.
 * Designed to fit borderlessly in the main content flow, styled with a
 * centered editorial header and an embedded RegisterForm.
 */
export default function RegisterPage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 pt-[120px] pb-[120px]">
      <header className="mb-[64px] text-center flex flex-col items-center">
        <h1 className="font-chapter-title text-[72px] sm:text-[96px] leading-[1] font-medium text-primary mb-6 tracking-tight">
          Register.
        </h1>
        <p className="font-body-prose text-[18px] leading-[1.6] text-muted-foreground max-w-[40ch]">
          Create a new account to join and contribute to this archive.
        </p>
      </header>
      
      <RegisterForm />
    </main>
  );
}
