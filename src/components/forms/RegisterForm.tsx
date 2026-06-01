'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterFormValues } from '@/lib/validators';
import { useRegisterMutation } from '@/hooks/queries/useAuthQueries';
import { ROUTES } from '@/lib/constants';

/**
 * RegisterForm Component
 * 
 * An editorially-styled, minimal form for registering new accounts.
 * Sits borderlessly and centered within the main layout content wrapper.
 */
export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', username: '', fullName: '', password: '', confirmPassword: '' },
  });

  const registerMutation = useRegisterMutation();

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({
      username: data.username,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {registerMutation.error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive font-body-prose">
            Registration failed. Please verify your details and try again.
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="reg-fullName" className="small-caps text-[12px] tracking-[0.2em] text-secondary font-medium">
            Full Name
          </Label>
          <Input 
            id="reg-fullName" 
            placeholder="John Doe" 
            className="font-body-prose border-[var(--color-hairline)] bg-transparent focus-visible:border-primary px-3 py-2 h-10 text-[16px]"
            {...register('fullName')} 
            aria-invalid={!!errors.fullName} 
          />
          {errors.fullName && <p className="text-xs text-destructive mt-1 font-body-prose">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-username" className="small-caps text-[12px] tracking-[0.2em] text-secondary font-medium">
            Username
          </Label>
          <Input 
            id="reg-username" 
            placeholder="johndoe" 
            className="font-body-prose border-[var(--color-hairline)] bg-transparent focus-visible:border-primary px-3 py-2 h-10 text-[16px]"
            {...register('username')} 
            aria-invalid={!!errors.username} 
          />
          {errors.username && <p className="text-xs text-destructive mt-1 font-body-prose">{errors.username.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-email" className="small-caps text-[12px] tracking-[0.2em] text-secondary font-medium">
            Email
          </Label>
          <Input 
            id="reg-email" 
            type="email" 
            placeholder="you@example.com" 
            autoComplete="email" 
            className="font-body-prose border-[var(--color-hairline)] bg-transparent focus-visible:border-primary px-3 py-2 h-10 text-[16px]"
            {...register('email')} 
            aria-invalid={!!errors.email} 
          />
          {errors.email && <p className="text-xs text-destructive mt-1 font-body-prose">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-password" className="small-caps text-[12px] tracking-[0.2em] text-secondary font-medium">
            Password
          </Label>
          <Input 
            id="reg-password" 
            type="password" 
            placeholder="••••••••" 
            className="font-body-prose border-[var(--color-hairline)] bg-transparent focus-visible:border-primary px-3 py-2 h-10 text-[16px]"
            {...register('password')} 
            aria-invalid={!!errors.password} 
          />
          {errors.password && <p className="text-xs text-destructive mt-1 font-body-prose">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-confirmPassword" className="small-caps text-[12px] tracking-[0.2em] text-secondary font-medium">
            Confirm Password
          </Label>
          <Input 
            id="reg-confirmPassword" 
            type="password" 
            placeholder="••••••••" 
            className="font-body-prose border-[var(--color-hairline)] bg-transparent focus-visible:border-primary px-3 py-2 h-10 text-[16px]"
            {...register('confirmPassword')} 
            aria-invalid={!!errors.confirmPassword} 
          />
          {errors.confirmPassword && <p className="text-xs text-destructive mt-1 font-body-prose">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer rounded-lg py-3 text-[13px] small-caps tracking-[0.15em] font-medium" disabled={registerMutation.isPending}>
          {registerMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Create Account
        </Button>
        <p className="text-center text-sm font-body-prose text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
