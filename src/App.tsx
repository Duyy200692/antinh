import React, { useState, useEffect, useMemo } from 'react';
import { DishItem, DayOfWeek, DishCategory } from './types';
import { INITIAL_DISHES, SHOP_INFO } from './data/mockDishes';
import {
  filterDishes,
  getDishesCountByDay,
  getCategoryCounts,
  getDayLabel,
  getTodayDayOfWeek,
} from './utils/dayUtils';
import { Header } from './components/Header';
import { DaySelector } from './components/DaySelector';
import { CategoryFilter } from './components/CategoryFilter';
import { DishCard } from './components/DishCard';
import { DishDetailModal } from './components/DishDetailModal';
import { AddEditDishModal } from './components/AddEditDishModal';
import { ShopInfoModal } from './components/ShopInfoModal';
import { WeeklyOverviewModal } from './components/WeeklyOverviewModal';
import { Sparkles, UtensilsCrossed, PlusCircle, RotateCcw, Calendar, PhoneCall } from 'lucide-react';

const STORAGE_KEY = 'tam_chay_internal_menu_dishes_v1';

export default function App() {
  // Dishes state with local persistence
  const [dishes, setDishes] = useState<DishItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load dishes from localStorage', e);
    }
    return INITIAL_DISHES;
  });

  // Persist dishes whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
    } catch (e) {
      console.error('Failed to save dishes to localStorage', e);
    }
  }, [dishes]);

  // Filter States
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'today'>('today');
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all_categories'>('all_categories');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [selectedDishForDetail, setSelectedDishForDetail] = useState<DishItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<DishItem | null>(null);
  const [isShopInfoModalOpen, setIsShopInfoModalOpen] = useState<boolean>(false);
  const [isWeeklyOverviewModalOpen, setIsWeeklyOverviewModalOpen] = useState<boolean>(false);

  // Reset category filter when switching days to make browsing intuitive
  const handleSelectDay = (day: DayOfWeek | 'today') => {
    setSelectedDay(day);
  };

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return filterDishes(dishes, selectedDay, selectedCategory, onlyAvailable, searchQuery);
  }, [dishes, selectedDay, selectedCategory, onlyAvailable, searchQuery]);

  // Counts
  const dishesCountByDay = useMemo(() => {
    return getDishesCountByDay(dishes);
  }, [dishes]);

  const categoryCounts = useMemo(() => {
    return getCategoryCounts(dishes, selectedDay);
  }, [dishes, selectedDay]);

  // Handlers for dish CRUD & stock toggle
  const handleToggleStock = (dishId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setDishes((prev) =>
      prev.map((dish) => {
        if (dish.id === dishId) {
          const updated = { ...dish, isAvailableToday: !dish.isAvailableToday };
          if (selectedDishForDetail?.id === dishId) {
            setSelectedDishForDetail(updated);
          }
          return updated;
        }
        return dish;
      })
    );
  };

  const handleSaveDish = (savedDish: DishItem) => {
    setDishes((prev) => {
      const exists = prev.some((d) => d.id === savedDish.id);
      if (exists) {
        return prev.map((d) => (d.id === savedDish.id ? savedDish : d));
      } else {
        return [savedDish, ...prev];
      }
    });
  };

  const handleDeleteDish = (dishId: string) => {
    setDishes((prev) => prev.filter((d) => d.id !== dishId));
    if (selectedDishForDetail?.id === dishId) {
      setSelectedDishForDetail(null);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Khôi phục danh sách món ăn gốc ban đầu của quán An Tịnh?')) {
      setDishes(INITIAL_DISHES);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Get current heading label for active day
  const currentDayHeading = useMemo(() => {
    if (selectedDay === 'today') {
      const today = getTodayDayOfWeek();
      return `Thực Đơn Hôm Nay (${getDayLabel(today)})`;
    }
    if (selectedDay === 'all') {
      return 'Món Làm Sẵn Cố Định Phục Vụ Cả Tuần';
    }
    return `Thực Đơn Áp Dụng: ${getDayLabel(selectedDay)}`;
  }, [selectedDay]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C05A3D]/20 selection:text-[#C05A3D]">
      {/* Editorial Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDay={selectedDay}
        setSelectedDay={handleSelectDay}
        onOpenAddModal={() => {
          setEditingDish(null);
          setIsAddModalOpen(true);
        }}
        onOpenShopInfoModal={() => setIsShopInfoModalOpen(true)}
        onOpenWeeklyOverviewModal={() => setIsWeeklyOverviewModalOpen(true)}
        totalDishesCount={dishes.length}
      />

      {/* Editorial Day Selector */}
      <DaySelector
        selectedDay={selectedDay}
        onSelectDay={handleSelectDay}
        dishesCountByDay={dishesCountByDay}
      />

      {/* Editorial Category Pill Bar */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onlyAvailable={onlyAvailable}
        onToggleOnlyAvailable={() => setOnlyAvailable(!onlyAvailable)}
        categoryCounts={categoryCounts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Section Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#C05A3D]" />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C05A3D] font-bold">
                Thực Đơn Nội Bộ • Bếp Ăn {SHOP_INFO.name}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A1A1A]">
              {currentDayHeading}
            </h2>
            <p className="font-sans text-xs text-[#1A1A1A]/60 mt-1">
              Hiển thị món ăn chay, xôi gấc, xôi lá cẩm & các món bún phở theo lịch trong tuần.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWeeklyOverviewModalOpen(true)}
              className="px-4 py-2 rounded-sm bg-[#F4F1EA] hover:bg-[#E5E1D8] text-[#1A1A1A] font-sans text-xs uppercase tracking-wider font-bold border border-black/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#C05A3D]" />
              <span>Xem Toàn Bộ Lịch Tuần</span>
            </button>
          </div>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onSelectDish={(d) => setSelectedDishForDetail(d)}
                onToggleStock={handleToggleStock}
              />
            ))}
          </div>
        ) : (
          /* Editorial Empty State */
          <div className="bg-[#F4F1EA] rounded-lg border border-black/10 p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#E5E1D8] flex items-center justify-center mx-auto mb-4 text-[#C05A3D]">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">
              Không tìm thấy món ăn nào
            </h3>
            <p className="font-sans text-xs text-[#1A1A1A]/70 mb-6 leading-relaxed">
              {searchQuery
                ? `Không có món chay nào khớp với từ khoá "${searchQuery}".`
                : 'Thực đơn trong danh mục hoặc ngày được chọn hiện đang trống hoặc tạm hết món.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {(searchQuery || selectedCategory !== 'all_categories' || onlyAvailable) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all_categories');
                    setOnlyAvailable(false);
                  }}
                  className="px-5 py-2.5 rounded-sm bg-[#1A1A1A] hover:bg-[#2D463E] text-white font-sans text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  Xoá bộ lọc & tìm kiếm
                </button>
              )}

              <button
                onClick={() => {
                  setEditingDish(null);
                  setIsAddModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-sm bg-[#C05A3D] hover:bg-[#A0452C] text-white font-sans text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm món mới ngay</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="mt-auto bg-[#F4F1EA] border-t border-black/10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-black/10">
            {/* Col 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🪷</span>
                <span className="font-serif font-black text-xl uppercase tracking-tighter text-[#1A1A1A]">
                  AN TỊNH CHAY
                </span>
              </div>
              <p className="text-xs text-[#1A1A1A]/70 font-sans leading-relaxed max-w-xs">
                {SHOP_INFO.name} • Hệ thống quản lý thực đơn nội bộ & xôi chay cho nhân viên. Các món chính luân phiên đảm bảo hương vị thanh tịnh, tự nhiên.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C05A3D] mb-3">
                Thời Gian & Đặt Món
              </h4>
              <ul className="space-y-2 text-xs font-sans text-[#1A1A1A]/80">
                <li>
                  <span className="font-bold">Giờ mở cửa:</span> {SHOP_INFO.openHours}
                </li>
                <li>
                  <span className="font-bold">Phụ trách:</span> {SHOP_INFO.contactPerson} ({SHOP_INFO.phone})
                </li>
                <li>
                  <span className="font-bold">Địa chỉ:</span> {SHOP_INFO.address}
                </li>
              </ul>
            </div>

            {/* Col 3: Staff Quick Tools */}
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#2D463E] mb-3">
                Công Cụ Quản Trị Nội Bộ
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setEditingDish(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-sm bg-[#1A1A1A] hover:bg-[#2D463E] text-white text-xs font-sans uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Thêm món</span>
                </button>

                <button
                  onClick={() => setIsWeeklyOverviewModalOpen(true)}
                  className="px-3.5 py-2 rounded-sm bg-[#E5E1D8] hover:bg-[#D9D1C2] text-[#1A1A1A] text-xs font-sans uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#C05A3D]" />
                  <span>Lịch tuần</span>
                </button>

                <button
                  onClick={handleResetToDefault}
                  className="px-3 py-2 rounded-sm bg-white hover:bg-[#E5E1D8] text-[#1A1A1A]/70 hover:text-[#1A1A1A] text-xs font-sans uppercase tracking-wider font-semibold border border-black/10 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Khôi phục danh sách món mẫu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục menu gốc</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#1A1A1A]/50">
            <p>© {new Date().getFullYear()} An Tịnh Chay • Internal Kitchen Staff Menu System.</p>
            <p className="font-serif italic">Thanh Tịnh • An Nhiên • Dinh Dưỡng</p>
          </div>
        </div>
      </footer>

      {/* Dish Detail Modal */}
      <DishDetailModal
        dish={selectedDishForDetail}
        onClose={() => setSelectedDishForDetail(null)}
        onToggleStock={(id) => handleToggleStock(id)}
        onEditDish={(dish) => {
          setSelectedDishForDetail(null);
          setEditingDish(dish);
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Dish Modal */}
      <AddEditDishModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDish(null);
        }}
        onSave={handleSaveDish}
        onDelete={handleDeleteDish}
        initialDish={editingDish}
      />

      {/* Shop Info Modal */}
      <ShopInfoModal
        isOpen={isShopInfoModalOpen}
        onClose={() => setIsShopInfoModalOpen(false)}
      />

      {/* Weekly Overview Modal */}
      <WeeklyOverviewModal
        isOpen={isWeeklyOverviewModalOpen}
        onClose={() => setIsWeeklyOverviewModalOpen(false)}
        dishes={dishes}
        onSelectDay={(day) => handleSelectDay(day)}
      />
    </div>
  );
}
