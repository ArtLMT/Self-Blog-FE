'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants';
import { useLanguageStore } from '@/store/language.store';
import { useQueryClient } from '@tanstack/react-query';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isAdmin, isInitialized, logout } = useAuth();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Safe client-side hydration for cookie & localStorage preference
    let saved: 'EN' | 'VN' | null = null;
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/selfblog_language=(EN|VN)/);
      if (match) saved = match[1] as 'EN' | 'VN';
    }
    if (!saved) {
      saved = localStorage.getItem('selfblog_language') as 'EN' | 'VN';
    }
    if (saved && saved !== 'EN') {
      setLanguage(saved);
    }
  }, [setLanguage]);

  const activeLang = mounted ? language : 'EN';

  const handleLanguageChange = (newLang: 'EN' | 'VN') => {
    setLanguage(newLang);
    // Invalidate client-side query cache (e.g. workspace panel)
    queryClient.invalidateQueries();
    // Re-execute Server Components data fetching for public routes
    router.refresh();
  };

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Chapters', href: '/chapters' },
    { name: 'Timeline', href: '/timeline' },
    { name: 'Now', href: '/now' },
    ...(isAdmin ? [{ name: 'Workspace', href: ROUTES.ADMIN.WORKSPACE }] : []),
  ];

  const getLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    const base = 'relative small-caps text-[14px] tracking-[0.2em] transition-colors duration-500 ease-in-out hover:text-secondary ' +
      'after:absolute after:bottom-[-6px] after:left-0 after:h-[1px] after:w-full ' +
      'after:origin-bottom-right after:scale-x-0 after:bg-secondary/50 after:transition-transform after:duration-500 after:ease-out hover:after:origin-bottom-left hover:after:scale-x-100';
    return isActive 
      ? `${base} text-secondary after:scale-x-100 after:origin-bottom-left`
      : `${base} text-foreground/70`;
  };

  const getMobileLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    const base = 'relative small-caps text-[10px] tracking-[0.2em] transition-colors duration-500 ease-in-out hover:text-secondary ' +
      'after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-full ' +
      'after:origin-bottom-right after:scale-x-0 after:bg-secondary/50 after:transition-transform after:duration-500 after:ease-out hover:after:origin-bottom-left hover:after:scale-x-100';
    return isActive 
      ? `${base} text-secondary after:scale-x-100 after:origin-bottom-left`
      : `${base} text-foreground/70`;
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border transition-colors duration-700">
      <div className="max-w-[720px] mx-auto px-6 py-5 flex justify-between items-center gap-4">
        {/* Left Area: Brand logo (Visible on all screen sizes) */}
        <div className="flex justify-start shrink-0">
          <div className="small-caps text-[12px] tracking-[0.2em] text-foreground font-bold">
            SelfBlog
          </div>
        </div>

        {/* Center Area: Desktop Links */}
        <nav className="hidden sm:flex justify-center items-center gap-6 md:gap-8 flex-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={getLinkClass(l.href)}>
              {l.name}
            </Link>
          ))}
        </nav>
        
        {/* Right Area: Language Toggle & User Auth */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 small-caps text-[12px] tracking-[0.2em] shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleLanguageChange('EN')} 
              className={`transition-colors duration-300 cursor-pointer ${activeLang === 'EN' ? 'text-foreground font-semibold' : 'text-foreground/40 hover:text-foreground/70'}`}
            >
              EN
            </button>
            <span className="text-foreground/20">/</span>
            <button 
              onClick={() => handleLanguageChange('VN')} 
              className={`transition-colors duration-300 cursor-pointer ${activeLang === 'VN' ? 'text-foreground font-semibold' : 'text-foreground/40 hover:text-foreground/70'}`}
            >
              VN
            </button>
          </div>
          
          <span className="text-foreground/20">|</span>

          {isInitialized && isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link 
                href={ROUTES.ADMIN.WORKSPACE} 
                className="text-foreground/70 hover:text-primary transition-colors duration-300 font-medium"
              >
                {user?.username || 'Admin'}
              </Link>
              <span className="text-foreground/20">/</span>
              <button 
                onClick={() => logout()}
                className="text-foreground/40 hover:text-destructive transition-colors duration-300 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href={ROUTES.LOGIN} 
              className="text-foreground/70 hover:text-primary transition-colors duration-300 font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="sm:hidden border-t border-border/50">
        <nav className="flex justify-between items-center px-6 py-3 overflow-x-auto gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={getMobileLinkClass(l.href)}>
              {l.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
