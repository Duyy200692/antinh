import React from 'react';
import { DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../data/mockDishes';
import { getTodayDayOfWeek, getDayLabel } from '../utils/dayUtils';
import { Calendar, Clock } from 'lucide-react';

interface DaySelectorProps {
  selectedDay: DayOfWeek | 'today';
  onSelectDay: (day: DayOfWeek | 'today') => void;
  dishesCountByDay: Record<string, number>;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDay,
  onSelectDay,
  dishesCountByDay,
}) => {
  const todayDay = getTodayDayOfWeek();

  return (
    <div className="bg-[#FDFCFB] border-b border-black/5 py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-1.5 text-[9px] sm:text-[10px] font-sans font-bold text-[#1A1A1A]/50 uppercase tracking-[0.2em]">
          <Calendar className="w-3 h-3 text-[#C05A3D]" />
          <span>Lọc theo ngày trong tuần:</span>
        </div>

        {/* Horizontal Scrollable Day Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {/* Quick Option: Today */}
          <button
            onClick={() => onSelectDay('today')}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-sans uppercase tracking-wider transition-all cursor-pointer border ${
              selectedDay === 'today'
                ? 'bg-[#C05A3D] text-white border-[#C05A3D] shadow-xs font-bold'
                : 'bg-[#F4F1EA] hover:bg-[#E5E1D8] text-[#C05A3D] border-[#C05A3D]/30 font-semibold'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Hôm nay ({getDayLabel(todayDay)})</span>
          </button>

          {/* Monday to Sunday Tabs */}
          {DAYS_OF_WEEK.filter((d) => d.id !== 'all').map((day) => {
            const isToday = day.id === todayDay;
            const isSelected = selectedDay === day.id;
            const count = dishesCountByDay[day.id] || 0;

            return (
              <button
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] sm:text-xs font-sans uppercase tracking-wider transition-all cursor-pointer border relative ${
                  isSelected
                    ? 'bg-[#2D463E] text-white border-[#2D463E] shadow-xs font-bold'
                    : isToday
                    ? 'bg-[#F4F1EA] hover:bg-[#E5E1D8] text-[#C05A3D] border-[#C05A3D]/40 font-bold'
                    : 'bg-[#F4F1EA] hover:bg-[#E5E1D8] text-[#1A1A1A]/80 border-black/5 font-semibold'
                }`}
              >
                <span>{day.shortLabel}</span>
                {isToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C05A3D]" title="Hôm nay" />
                )}
                <span
                  className={`text-[9px] px-1 py-0.2 rounded-xs font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isToday
                      ? 'bg-[#E5E1D8] text-[#C05A3D]'
                      : 'bg-[#E5E1D8] text-[#1A1A1A]/70'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
