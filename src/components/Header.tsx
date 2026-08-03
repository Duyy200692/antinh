import React from 'react';
import { Search, PlusCircle, Calendar, Info, Sparkles } from 'lucide-react';
import { DayOfWeek } from '../types';
import { getDayLabel, getTodayDayOfWeek } from '../utils/dayUtils';
import { SHOP_INFO } from '../data/mockDishes';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDay: DayOfWeek | 'today';
  setSelectedDay: (day: DayOfWeek | 'today') => void;
  onOpenAddModal: () => void;
  onOpenShopInfoModal: () => void;
  onOpenWeeklyOverviewModal: () => void;
  totalDishesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDay,
  setSelectedDay,
  onOpenAddModal,
  onOpenShopInfoModal,
  onOpenWeeklyOverviewModal,
  totalDishesCount,
}) => {
  const todayDay = getTodayDayOfWeek();
  const todayLabel = getDayLabel(todayDay);

  return (
    <header className="sticky top-0 z-30 bg-[#FDFCFB] text-[#1A1A1A] shadow-xs border-b border-black/10">
      {/* Top Banner - Editorial subtle notice */}
      <div className="bg-[#F4F1EA] text-xs py-1.5 px-4 border-b border-black/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#1A1A1A]/80">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C05A3D] animate-pulse" />
            <span className="font-serif font-bold tracking-wide">{SHOP_INFO.name}</span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="hidden sm:inline font-sans text-[11px] uppercase tracking-wider text-[#1A1A1A]/70">LH: {SHOP_INFO.contactPerson} ({SHOP_INFO.phone})</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenShopInfoModal}
              className="flex items-center gap-1 text-[#C05A3D] hover:text-[#A0452C] transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Thông tin quán & Đặt xôi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E5E1D8] border border-black/10 flex items-center justify-center shadow-xs text-[#C05A3D] font-bold text-xl shrink-0">
              <span className="text-2xl">🪷</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-serif font-black uppercase tracking-tighter leading-none text-[#1A1A1A]">
                  AN TỊNH CHAY
                </h1>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-sm bg-[#2D463E] text-white">
                  Bếp Nội Bộ
                </span>
              </div>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mt-1">
                Món Làm Sẵn Cố Định • Seasonal Daily Menu
              </span>
            </div>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
              <input
                type="text"
                placeholder="Tìm món chay, xôi, bánh mì..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[#F4F1EA] border border-black/10 rounded-lg text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:ring-1 focus:ring-[#C05A3D] focus:border-[#C05A3D] transition-all font-sans"
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

            {/* Actions for Internal Menu App */}
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={onOpenWeeklyOverviewModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E5E1D8] hover:bg-[#D9D1C2] text-[#1A1A1A] text-xs sm:text-sm font-sans uppercase tracking-wider font-bold border border-black/10 transition-colors cursor-pointer whitespace-nowrap"
                title="Xem tổng quan lịch món trong tuần"
              >
                <Calendar className="w-4 h-4 text-[#C05A3D]" />
                <span>Lịch tuần</span>
              </button>

              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2D463E] hover:bg-[#1f332d] text-white font-sans uppercase tracking-wider font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 text-[#C05A3D]" />
                <span>Thêm món</span>
              </button>
            </div>
          </div>
        </div>

        {/* Today's Special Indicator Banner */}
        <div className="mt-4 pt-3 border-t border-black/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#C05A3D] text-white font-sans text-[10px] uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hôm nay: {todayLabel}</span>
            </span>
            <span className="font-sans text-xs text-[#1A1A1A]/60 italic">
              Đang hiển thị {totalDishesCount} món trong thực đơn
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-semibold">
            <button
              onClick={() => setSelectedDay('today')}
              className={`px-3 py-1.5 rounded-sm transition-all cursor-pointer ${
                selectedDay === 'today'
                  ? 'bg-[#C05A3D] text-white font-bold shadow-xs'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#E5E1D8]/50'
              }`}
            >
              Thực đơn hôm nay
            </button>
            <span className="text-[#1A1A1A]/20">•</span>
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1.5 rounded-sm transition-all cursor-pointer ${
                selectedDay === 'all'
                  ? 'bg-[#2D463E] text-white font-bold shadow-xs'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#E5E1D8]/50'
              }`}
            >
              Món cố định ({'làm sẵn & xôi bánh'})
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
