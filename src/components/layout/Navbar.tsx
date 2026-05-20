'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="w-full top-0 sticky bg-surface/90 backdrop-blur-sm z-40 transition-opacity duration-700 ease-in-out">
      <div className="flex justify-between items-center max-w-[720px] mx-auto px-6 py-6">
        <span className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] font-normal text-primary transition-opacity duration-700 ease-in-out cursor-default">
          Introduction
        </span>
        <div className="flex gap-6 items-center">
          <Link
            className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] lowercase text-secondary font-bold hover:text-secondary transition-colors duration-500 ease-out"
            href="#"
          >
            chapters
          </Link>
          <Link
            className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] lowercase text-ink-mute hover:text-secondary transition-colors duration-500 ease-out"
            href="#"
          >
            quotes
          </Link>
          <Link
            className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] lowercase text-ink-mute hover:text-secondary transition-colors duration-500 ease-out"
            href="#"
          >
            guestbook
          </Link>
          <Link
            className="font-metadata text-[12px] leading-[1.5] tracking-[0.05em] lowercase text-ink-mute hover:text-secondary transition-colors duration-500 ease-out"
            href="#"
          >
            login
          </Link>
        </div>
      </div>
      <div
        className={`w-full h-px bg-rule transition-opacity duration-500 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
    </nav>
  );
}
