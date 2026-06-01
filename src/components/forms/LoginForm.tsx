'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormValues } from '@/lib/validators';
import { useLoginMutation } from '@/hooks/queries/useAuthQueries';
import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/store/auth.store';

/**
 * LoginForm Component
 * 
 * An editorially-styled, minimal form for authenticating users.
 * Sits borderlessly and centered within the main layout content wrapper.
 */
export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const loginMutation = useLoginMutation();
  const authError = useAuthStore((state) => state.error);

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {loginMutation.error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive font-body-prose">
            {authError || 'Login failed. Please verify your credentials and try again.'}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="login-username" className="small-caps text-[12px] tracking-[0.2em] text-secondary font-medium">
            Username
          </Label>
          <Input 
            id="login-username" 
            type="text" 
            placeholder="username" 
            autoComplete="username" 
            className="font-body-prose border-[var(--color-hairline)] bg-transparent focus-visible:border-primary px-3 py-2 h-10 text-[16px]"
            {...register('username')} 
            aria-invalid={!!errors.username} 
          />
          {errors.username && <p className="text-xs text-destructive mt-1 font-body-prose">{errors.username.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password" className="small-caps text-[12px] tracking-[0.2em] text-secondary font-medium">
            Password
          </Label>
          <Input 
            id="login-password" 
            type="password" 
            placeholder="••••••••" 
            autoComplete="current-password" 
            className="font-body-prose border-[var(--color-hairline)] bg-transparent focus-visible:border-primary px-3 py-2 h-10 text-[16px]"
            {...register('password')} 
            aria-invalid={!!errors.password} 
          />
          {errors.password && <p className="text-xs text-destructive mt-1 font-body-prose">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer rounded-lg py-3 text-[13px] small-caps tracking-[0.15em] font-medium" disabled={loginMutation.isPending}>
          {loginMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Sign In
        </Button>
        <p className="text-center text-sm font-body-prose text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.REGISTER} className="font-medium text-primary underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
