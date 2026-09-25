import React from 'react';
import { Search, PlusCircle, Calendar, Info, Sparkles, ShieldCheck, LogOut, UserCheck, Edit3 } from 'lucide-react';
import { DayOfWeek, ShopInfo, Language } from '../types';
import { getDayLabel, getTodayDayOfWeek } from '../utils/dayUtils';
import { SHOP_INFO as DEFAULT_SHOP_INFO } from '../data/mockDishes';
import { TRANSLATIONS, getLocalizedShopInfo } from '../utils/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDay: DayOfWeek | 'today';
  setSelectedDay: (day: DayOfWeek | 'today') => void;
  onOpenAddModal: () => void;
  onOpenShopInfoModal: () => void;
  onOpenWeeklyOverviewModal: () => void;
  onOpenAdminModal: () => void;
  shopInfo?: ShopInfo;
  totalDishesCount: number;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
  onOpenAuthModal: () => void;
  mainTab: 'today' | 'fixed' | 'all';
  setMainTab: (tab: 'today' | 'fixed' | 'all') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDay,
  setSelectedDay,
  onOpenAddModal,
  onOpenShopInfoModal,
  onOpenWeeklyOverviewModal,
  onOpenAdminModal,
  shopInfo = DEFAULT_SHOP_INFO,
  totalDishesCount,
  isAdminLoggedIn,
  onLogoutAdmin,
  onOpenAuthModal,
  mainTab,
  setMainTab,
  language,
  onLanguageChange,
}) => {
  const t = TRANSLATIONS[language];
  const localizedShop = getLocalizedShopInfo(shopInfo, language);
  const todayDay = getTodayDayOfWeek();
  const todayLabel = getDayLabel(todayDay, language);

  return (
    <header className="relative sm:sticky top-0 z-30 bg-[#FDFCFB] text-[#1A1A1A] shadow-xs border-b border-black/10">
      {/* Top Admin Status Bar (Only visible when Admin is logged in) */}
      {isAdminLoggedIn && (
        <div 
          onClick={onOpenAdminModal}
          className="bg-[#2D463E] text-white text-xs py-1.5 px-3 sm:px-4 border-b border-black/10 hover:bg-[#1f332d] transition-colors cursor-pointer"
          title="Bấm để mở bảng quản trị"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-sans truncate">
              <UserCheck className="w-3.5 h-3.5 text-[#C05A3D] shrink-0" />
              <span className="font-bold text-[#E5E1D8] text-[11px] sm:text-xs truncate">
                {t.adminModeNotice}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={onOpenShopInfoModal}
                className="px-2 py-0.5 rounded bg-[#E5E1D8]/20 hover:bg-[#C05A3D] text-white font-sans text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                title={t.editShopQuick}
              >
                <Edit3 className="w-3 h-3 text-[#C05A3D]" />
                <span className="hidden sm:inline">{t.editShopQuick}</span>
              </button>
              <button
                onClick={onOpenAdminModal}
                className="px-2.5 py-0.5 rounded bg-[#C05A3D] hover:bg-[#a0452c] text-white font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {t.kitchenFocus}
              </button>
              <button
                onClick={onLogoutAdmin}
                className="flex items-center gap-1 text-[#E5E1D8]/80 hover:text-white transition-colors text-[11px] font-semibold uppercase tracking-wider cursor-pointer ml-1"
                title={t.logout}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Brand & Subtitle with quick contact */}
          <div className="flex items-center justify-between gap-2.5 sm:gap-3.5">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <button
                onClick={onOpenShopInfoModal}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E5E1D8] border border-black/10 flex items-center justify-center shadow-xs text-[#C05A3D] font-bold text-xl sm:text-2xl shrink-0 cursor-pointer hover:scale-105 transition-transform"
                title={t.shopInfoModalTitle}
              >
                <span>🪷</span>
              </button>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 
                    onClick={onOpenShopInfoModal}
                    className="text-xl sm:text-2xl lg:text-3xl font-serif font-black uppercase tracking-tight leading-tight text-[#1A1A1A] cursor-pointer hover:text-[#C05A3D] transition-colors"
                    title={t.shopInfoModalTitle}
                  >
                    {localizedShop.name}
                  </h1>
                  {isAdminLoggedIn ? (
                    <button
                      onClick={onOpenShopInfoModal}
                      title={t.editShopQuick}
                      className="p-1 rounded bg-[#F4F1EA] hover:bg-[#C05A3D] text-[#C05A3D] hover:text-white border border-black/10 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider hidden sm:inline">
                        {t.editShopQuick}
                      </span>
                    </button>
                  ) : (
                    <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold px-1.5 sm:px-2 py-0.5 rounded-sm bg-[#2D463E] text-white shrink-0">
                      {t.menuBadge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 font-sans text-[10px] sm:text-xs text-[#1A1A1A]/70 mt-0.5 flex-wrap">
                  <span className="font-medium tracking-wide">
                    {localizedShop.slogan || t.menuSubtitle}
                  </span>
                  {localizedShop.phone && (
                    <>
                      <span className="opacity-40">•</span>
                      <a 
                        href={`tel:${localizedShop.phone.replace(/[^0-9+]/g, '')}`}
                        className="font-bold text-[#C05A3D] hover:underline"
                        title={t.callToOrderBtn}
                      >
                        📞 {localizedShop.phone}
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile-only Language Switcher */}
            <div className="lg:hidden shrink-0">
              <LanguageSwitcher
                currentLang={language}
                onLanguageChange={onLanguageChange}
                variant="header"
              />
            </div>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-52 md:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
              <input
                id="header-search-input"
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-[#F4F1EA] border border-black/10 rounded-lg text-xs sm:text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:ring-1 focus:ring-[#C05A3D] focus:border-[#C05A3D] transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#C05A3D] hover:underline font-medium"
                >
                  {t.clearSearch}
                </button>
              )}
            </div>

            {/* Desktop Language Switcher */}
            <div className="hidden lg:block shrink-0">
              <LanguageSwitcher
                currentLang={language}
                onLanguageChange={onLanguageChange}
                variant="header"
              />
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-1.5 sm:gap-2 justify-end flex-wrap sm:flex-nowrap ${!isAdminLoggedIn ? 'hidden sm:flex' : ''}`}>
              {/* Contact / Shop Info Button (hidden on mobile, present in mobile bottom nav) */}
              <button
                onClick={onOpenShopInfoModal}
                className="hidden sm:flex flex-1 sm:flex-initial items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#F4F1EA] hover:bg-[#E5E1D8] text-[#1A1A1A] text-xs font-sans uppercase tracking-wider font-bold border border-black/10 transition-colors cursor-pointer whitespace-nowrap"
                title={t.shopInfoModalTitle}
              >
                <Info className="w-3.5 h-3.5 text-[#C05A3D]" />
                <span>{t.contact}</span>
              </button>

              {/* Weekly Schedule Button (hidden on mobile, present in mobile bottom nav) */}
              <button
                onClick={onOpenWeeklyOverviewModal}
                className="hidden sm:flex flex-1 sm:flex-initial items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#E5E1D8] hover:bg-[#D9D1C2] text-[#1A1A1A] text-xs font-sans uppercase tracking-wider font-bold border border-black/10 transition-colors cursor-pointer whitespace-nowrap"
                title={t.weekScheduleBtn}
              >
                <Calendar className="w-3.5 h-3.5 text-[#C05A3D]" />
                <span>{t.weekScheduleBtn}</span>
              </button>

              {isAdminLoggedIn && (
                <>
                  <button
                    onClick={onOpenAddModal}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#2D463E] hover:bg-[#1f332d] text-white font-sans uppercase tracking-wider font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#C05A3D]" />
                    <span>{t.addDishBtn}</span>
                  </button>
                  <button
                    onClick={onOpenAdminModal}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#C05A3D] text-white text-xs font-sans uppercase tracking-wider font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E5E1D8]" />
                    <span className="hidden sm:inline">{t.kitchenBoardBtn}</span>
                    <span className="sm:hidden">Bếp</span>
                  </button>
                  <button
                    onClick={onLogoutAdmin}
                    className="p-1.5 sm:p-2 rounded-lg bg-[#F4F1EA] hover:bg-red-50 text-red-600 border border-black/10 transition-colors cursor-pointer"
                    title={t.logout}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dual Tab Navigation: Món Ăn Hôm Nay vs Món Cố Định (hidden on mobile, controlled via bottom nav) */}
        <div className="hidden sm:flex mt-3 pt-2.5 border-t border-black/10 flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-[#F4F1EA] p-1 rounded-lg border border-black/10 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setMainTab('today');
                setSelectedDay('today');
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-sans text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                mainTab === 'today'
                  ? 'bg-[#C05A3D] text-white shadow-xs'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{t.tabToday} ({todayLabel})</span>
            </button>

            <button
              onClick={() => {
                setMainTab('fixed');
                setSelectedDay('all');
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-sans text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                mainTab === 'fixed'
                  ? 'bg-[#2D463E] text-white shadow-xs'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              <span>{t.tabFixed}</span>
            </button>

            <button
              onClick={() => setMainTab('all')}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md font-sans text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shrink-0 ${
                mainTab === 'all'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              {t.tabAll}
            </button>
          </div>

          <div className="text-[11px] sm:text-xs font-sans text-[#1A1A1A]/60 italic flex items-center justify-between sm:justify-end gap-2">
            <span>{t.showingCount}: <strong>{totalDishesCount} {t.dishesUnit}</strong></span>
            {!isAdminLoggedIn && (
              <span className="px-2 py-0.5 rounded bg-[#E5E1D8] text-[#1A1A1A] font-semibold not-italic text-[10px]">
                {t.guestViewBadge}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


