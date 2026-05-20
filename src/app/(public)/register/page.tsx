import type { Metadata } from 'next';
import { RegisterForm } from '@/components/forms/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new SelfBlog account to start blogging.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  );
}
