import React from 'react';
import { Sparkles, Layers, Search, Info, ShieldCheck, Calendar } from 'lucide-react';

interface MobileBottomNavProps {
  mainTab: 'today' | 'fixed' | 'all';
  setMainTab: (tab: 'today' | 'fixed' | 'all') => void;
  onOpenSearch: () => void;
  onOpenShopInfo: () => void;
  onOpenAdmin: () => void;
  onOpenWeeklyOverview: () => void;
  isAdminLoggedIn: boolean;
  todayLabel: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  mainTab,
  setMainTab,
  onOpenSearch,
  onOpenShopInfo,
  onOpenAdmin,
  onOpenWeeklyOverview,
  isAdminLoggedIn,
  todayLabel,
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A1A]/95 text-[#FDFCFB] backdrop-blur-lg border-t border-white/10 shadow-2xl pb-safe">
      <div className="grid grid-cols-5 items-center justify-around h-15 px-1">
        {/* Tab 1: Today's Menu */}
        <button
          onClick={() => setMainTab('today')}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            mainTab === 'today' ? 'text-[#C05A3D]' : 'text-white/60 hover:text-white'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            {mainTab === 'today' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C05A3D]" />
            )}
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-tight mt-1">
            Hôm Nay
          </span>
        </button>

        {/* Tab 2: Fixed Weekly Menu */}
        <button
          onClick={() => setMainTab('fixed')}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            mainTab === 'fixed' ? 'text-[#C05A3D]' : 'text-white/60 hover:text-white'
          }`}
        >
          <div className="relative">
            <Layers className="w-5 h-5" />
            {mainTab === 'fixed' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C05A3D]" />
            )}
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-tight mt-1">
            Cố Định
          </span>
        </button>

        {/* Tab 3: Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center h-full text-white/60 hover:text-white transition-all cursor-pointer"
        >
          <Search className="w-5 h-5 text-[#E5E1D8]" />
          <span className="text-[10px] font-sans font-bold uppercase tracking-tight mt-1">
            Tìm Kiếm
          </span>
        </button>

        {/* Tab 4: Shop Info */}
        <button
          onClick={onOpenShopInfo}
          className="flex flex-col items-center justify-center h-full text-white/60 hover:text-white transition-all cursor-pointer"
        >
          <Info className="w-5 h-5 text-[#E5E1D8]" />
          <span className="text-[10px] font-sans font-bold uppercase tracking-tight mt-1">
            Quán
          </span>
        </button>

        {/* Tab 5: Admin Control */}
        <button
          onClick={onOpenAdmin}
          className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
            isAdminLoggedIn ? 'text-[#C05A3D]' : 'text-white/60 hover:text-white'
          }`}
        >
          <div className="relative">
            <ShieldCheck className="w-5 h-5" />
            {isAdminLoggedIn && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-tight mt-1">
            {isAdminLoggedIn ? 'Bếp Admin' : 'Đăng Nhập'}
          </span>
        </button>
      </div>
    </nav>
  );
};
