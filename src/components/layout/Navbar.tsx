'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<'EN' | 'VN'>('EN');

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Chapters', href: '/chapters' },
    { name: 'Timeline', href: '/timeline' },
    { name: 'Now', href: '/now' },
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
      <div className="max-w-[720px] mx-auto px-6 py-5 flex justify-between sm:grid sm:grid-cols-3 items-center">
        {/* Left Area: Mobile Title (Hidden on sm screens and up) */}
        <div className="flex justify-start">
          <div className="sm:hidden small-caps text-[12px] tracking-[0.2em] text-foreground font-bold">
            SelfBlog
          </div>
        </div>

        {/* Center Area: Desktop Links */}
        <nav className="hidden sm:flex justify-center items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={getLinkClass(l.href)}>
              {l.name}
            </Link>
          ))}
        </nav>
        
        {/* Right Area: Language Toggle */}
        <div className="flex items-center justify-end gap-2 small-caps text-[12px] tracking-[0.2em]">
          <button 
            onClick={() => setLang('EN')} 
            className={`transition-colors duration-300 ${lang === 'EN' ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70'}`}
          >
            EN
          </button>
          <span className="text-foreground/20">/</span>
          <button 
            onClick={() => setLang('VN')} 
            className={`transition-colors duration-300 ${lang === 'VN' ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70'}`}
          >
            VN
          </button>
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
