import React from 'react';
import { Language } from '../utils/i18n';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  variant?: 'header' | 'banner' | 'compact' | 'footer';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onLanguageChange,
  variant = 'header',
  className = '',
}) => {
  if (variant === 'banner') {
    return (
      <div className={`inline-flex items-center gap-1 bg-black/10 hover:bg-black/15 dark:bg-white/10 rounded-full p-0.5 transition-colors ${className}`}>
        <button
          type="button"
          onClick={() => onLanguageChange('vi')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
            currentLang === 'vi'
              ? 'bg-[#C05A3D] text-white shadow-xs'
              : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
          }`}
          title="Tiếng Việt"
        >
          <span>🇻🇳</span>
          <span>VI</span>
        </button>
        <button
          type="button"
          onClick={() => onLanguageChange('en')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
            currentLang === 'en'
              ? 'bg-[#2D463E] text-white shadow-xs'
              : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
          }`}
          title="English"
        >
          <span>🇬🇧</span>
          <span>EN</span>
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={() => onLanguageChange(currentLang === 'vi' ? 'en' : 'vi')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans font-bold uppercase tracking-wider bg-[#F4F1EA] hover:bg-[#E5E1D8] text-[#1A1A1A] border border-black/10 transition-all cursor-pointer shadow-2xs ${className}`}
        title={currentLang === 'vi' ? 'Switch to English' : 'Đổi sang Tiếng Việt'}
      >
        <Globe className="w-3.5 h-3.5 text-[#C05A3D]" />
        <span>{currentLang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
      </button>
    );
  }

  // Default 'header' variant
  return (
    <div
      className={`flex items-center bg-[#F4F1EA] p-0.5 rounded-lg border border-black/10 shadow-2xs ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => onLanguageChange('vi')}
        className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
          currentLang === 'vi'
            ? 'bg-[#C05A3D] text-white shadow-xs'
            : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
        }`}
        title="Tiếng Việt"
      >
        <span className="text-xs">🇻🇳</span>
        <span>VI</span>
      </button>

      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
          currentLang === 'en'
            ? 'bg-[#2D463E] text-white shadow-xs'
            : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
        }`}
        title="English"
      >
        <span className="text-xs">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};
