import { create } from 'zustand';

export type LanguageOption = 'EN' | 'VN';

interface LanguageState {
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'EN', // Always default to EN for initial SSR/hydration consistency
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selfblog_language', lang);
      document.cookie = `selfblog_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
    set({ language: lang });
  },
}));
