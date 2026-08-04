import React from 'react';
import { Search, PlusCircle, Calendar, Info, Sparkles, ShieldCheck, LogOut, UserCheck } from 'lucide-react';
import { DayOfWeek, ShopInfo } from '../types';
import { getDayLabel, getTodayDayOfWeek } from '../utils/dayUtils';
import { SHOP_INFO as DEFAULT_SHOP_INFO } from '../data/mockDishes';

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
}) => {
  const todayDay = getTodayDayOfWeek();
  const todayLabel = getDayLabel(todayDay);

  return (
    <header className="relative sm:sticky top-0 z-30 bg-[#FDFCFB] text-[#1A1A1A] shadow-xs border-b border-black/10">
      {/* Top Admin Banner Status */}
      {isAdminLoggedIn ? (
        <div className="bg-[#2D463E] text-white text-xs py-1.5 px-3 sm:px-4 border-b border-black/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-sans truncate">
              <UserCheck className="w-3.5 h-3.5 text-[#C05A3D] shrink-0" />
              <span className="font-bold text-[#E5E1D8] text-[11px] sm:text-xs truncate">
                🔑 Chế độ Admin Bếp (Sửa món/báo hết)
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenAdminModal}
                className="px-2 py-0.5 rounded bg-[#C05A3D] hover:bg-[#a0452c] text-white font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Trọng tâm Bếp
              </button>
              <button
                onClick={onLogoutAdmin}
                className="hidden sm:flex items-center gap-1 text-[#E5E1D8]/80 hover:text-white transition-colors text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Thoát</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#F4F1EA] text-xs py-1 sm:py-1.5 px-3 sm:px-4 border-b border-black/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[#1A1A1A]/80 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-[#C05A3D] animate-pulse shrink-0" />
              <span className="font-serif font-bold tracking-wide text-xs truncate">{shopInfo.name}</span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span className="hidden sm:inline font-sans text-[11px] uppercase tracking-wider text-[#1A1A1A]/70">
                LH: {shopInfo.contactPerson} ({shopInfo.phone})
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenShopInfoModal}
                className="flex items-center gap-1 text-[#C05A3D] hover:text-[#A0452C] transition-colors text-[11px] sm:text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Liên hệ</span>
              </button>
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1 text-[#1A1A1A] hover:text-[#C05A3D] transition-colors text-[11px] sm:text-xs font-semibold uppercase tracking-wider cursor-pointer ml-1 sm:ml-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C05A3D]" />
                <span className="hidden sm:inline">Đăng nhập Admin Bếp</span>
                <span className="sm:hidden">Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#E5E1D8] border border-black/10 flex items-center justify-center shadow-xs text-[#C05A3D] font-bold text-lg sm:text-xl shrink-0">
              <span className="text-xl sm:text-2xl">🪷</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-serif font-black uppercase tracking-tight leading-tight text-[#1A1A1A]">
                  {shopInfo.name}
                </h1>
                {isAdminLoggedIn ? (
                  <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold px-1.5 sm:px-2 py-0.5 rounded-sm bg-[#C05A3D] text-white">
                    Admin
                  </span>
                ) : (
                  <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold px-1.5 sm:px-2 py-0.5 rounded-sm bg-[#2D463E] text-white">
                    Thực Đơn
                  </span>
                )}
              </div>
              <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold opacity-60 mt-0.5">
                {shopInfo.slogan || 'Món Ăn Hôm Nay & Món Cố Định Cả Tuần'}
              </span>
            </div>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
              <input
                id="header-search-input"
                type="text"
                placeholder="Tìm món chay, xôi, bánh mì..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-[#F4F1EA] border border-black/10 rounded-lg text-xs sm:text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:ring-1 focus:ring-[#C05A3D] focus:border-[#C05A3D] transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#C05A3D] hover:underline font-medium"
                >
                  Xoá
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={onOpenWeeklyOverviewModal}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#E5E1D8] hover:bg-[#D9D1C2] text-[#1A1A1A] text-xs font-sans uppercase tracking-wider font-bold border border-black/10 transition-colors cursor-pointer whitespace-nowrap"
                title="Xem tổng quan lịch món trong tuần"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C05A3D]" />
                <span>Lịch tuần</span>
              </button>

              {isAdminLoggedIn ? (
                <>
                  <button
                    onClick={onOpenAddModal}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#2D463E] hover:bg-[#1f332d] text-white font-sans uppercase tracking-wider font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#C05A3D]" />
                    <span>Thêm món</span>
                  </button>
                  <button
                    onClick={onOpenAdminModal}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#C05A3D] text-white text-xs font-sans uppercase tracking-wider font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E5E1D8]" />
                    <span>Bảng Bếp</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#C05A3D] text-white text-xs font-sans uppercase tracking-wider font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E5E1D8]" />
                  <span>Quản Trị Bếp</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dual Tab Navigation: Món Ăn Hôm Nay vs Món Cố Định */}
        <div className="mt-3 pt-2.5 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
              <span>1. Món Hôm Nay ({todayLabel})</span>
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
              <span>2. Món Cố Định</span>
            </button>

            <button
              onClick={() => setMainTab('all')}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md font-sans text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shrink-0 ${
                mainTab === 'all'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              Tất Cả
            </button>
          </div>

          <div className="text-[11px] sm:text-xs font-sans text-[#1A1A1A]/60 italic flex items-center justify-between sm:justify-end gap-2">
            <span>Hiển thị: <strong>{totalDishesCount} món</strong></span>
            {!isAdminLoggedIn && (
              <span className="px-2 py-0.5 rounded bg-[#E5E1D8] text-[#1A1A1A] font-semibold not-italic text-[10px]">
                Khách xem
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

