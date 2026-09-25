import React, { useState, useEffect, useMemo } from 'react';
import { DishItem, DayOfWeek, DishCategory, ShopInfo, Language, StickyRiceCategoryInfo } from './types';
import { INITIAL_DISHES, SHOP_INFO as DEFAULT_SHOP_INFO, DEFAULT_STICKY_RICE_CATEGORY_INFO } from './data/mockDishes';
import {
  filterDishes,
  getDishesCountByDay,
  getCategoryCounts,
  getDayLabel,
  getTodayDayOfWeek,
} from './utils/dayUtils';
import { TRANSLATIONS, LANGUAGE_STORAGE_KEY, getLocalizedShopInfo } from './utils/i18n';
import { Header } from './components/Header';
import { DaySelector } from './components/DaySelector';
import { CategoryFilter } from './components/CategoryFilter';
import { DishCard } from './components/DishCard';
import { DishDetailModal } from './components/DishDetailModal';
import { AddEditDishModal } from './components/AddEditDishModal';
import { ShopInfoModal } from './components/ShopInfoModal';
import { WeeklyOverviewModal } from './components/WeeklyOverviewModal';
import { AdminModal } from './components/AdminModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StickyRiceOrderModal } from './components/StickyRiceOrderModal';
import {
  subscribeToDishes,
  saveDishToFirestore,
  deleteDishFromFirestore,
  seedInitialDishesToFirestore,
  syncAllDishesToFirestore,
  subscribeToShopInfo,
  saveShopInfoToFirestore,
  subscribeToAdminPin,
  saveAdminPinToFirestore,
  subscribeToStickyRiceCategory,
  saveStickyRiceCategoryToFirestore,
  testFirestoreConnection,
} from './firebase';
import { Sparkles, UtensilsCrossed, PlusCircle, RotateCcw, Calendar, ShieldCheck, Flame, Layers, Info } from 'lucide-react';

const DISHES_STORAGE_KEY = 'tam_chay_internal_menu_dishes_v2';
const SHOP_STORAGE_KEY = 'tam_chay_shop_info_v2';
const STICKY_RICE_CAT_STORAGE_KEY = 'tam_chay_sticky_rice_category_v2';
const ADMIN_AUTH_KEY = 'tam_chay_admin_logged_in_v1';
const ADMIN_PIN_STORAGE_KEY = 'tam_chay_admin_pin_code_v1';

export default function App() {
  // Language State (Vietnamese / English)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'vi') return saved;
    } catch (e) {
      // ignore
    }
    return 'vi';
  });

  // Sync html lang tag and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch (e) {
      console.error('Failed to save language', e);
    }
  }, [language]);

  // Admin PIN State (defaults to 1234, synced to Firestore & localStorage)
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || '1234';
    } catch (e) {
      return '1234';
    }
  });
  // Dishes state
  const [dishes, setDishes] = useState<DishItem[]>(() => {
    try {
      const saved = localStorage.getItem(DISHES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load dishes from localStorage', e);
    }
    return INITIAL_DISHES;
  });

  // Shop Info State
  const [shopInfo, setShopInfo] = useState<ShopInfo>(() => {
    try {
      const saved = localStorage.getItem(SHOP_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load shop info', e);
    }
    return DEFAULT_SHOP_INFO;
  });

  // Sticky Rice Category Info State
  const [stickyRiceCategory, setStickyRiceCategory] = useState<StickyRiceCategoryInfo>(() => {
    try {
      const saved = localStorage.getItem(STICKY_RICE_CAT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load sticky rice category info', e);
    }
    return DEFAULT_STICKY_RICE_CATEGORY_INFO;
  });

  // Firebase connection test & real-time listeners
  useEffect(() => {
    testFirestoreConnection();

    // Subscribe to Firestore Dishes
    const unsubscribeDishes = subscribeToDishes((remoteDishes) => {
      if (remoteDishes && remoteDishes.length > 0) {
        setDishes(remoteDishes);
      } else {
        // If Firestore is empty, seed initial dishes
        seedInitialDishesToFirestore(INITIAL_DISHES);
      }
    });

    // Subscribe to Firestore Shop Info
    const unsubscribeShop = subscribeToShopInfo((remoteShop) => {
      if (remoteShop && remoteShop.name) {
        setShopInfo(remoteShop);
      } else {
        saveShopInfoToFirestore(DEFAULT_SHOP_INFO);
      }
    });

    // Subscribe to Firestore Sticky Rice Category Info
    const unsubscribeStickyRice = subscribeToStickyRiceCategory((remoteCat) => {
      if (remoteCat && remoteCat.title) {
        setStickyRiceCategory(remoteCat);
      } else {
        saveStickyRiceCategoryToFirestore(DEFAULT_STICKY_RICE_CATEGORY_INFO);
      }
    });

    // Subscribe to Firestore Admin PIN
    const unsubscribePin = subscribeToAdminPin((remotePin) => {
      if (remotePin) {
        setAdminPin(remotePin);
        try {
          localStorage.setItem(ADMIN_PIN_STORAGE_KEY, remotePin);
        } catch (e) {
          // ignore
        }
      }
    });

    return () => {
      unsubscribeDishes();
      unsubscribeShop();
      unsubscribeStickyRice();
      unsubscribePin();
    };
  }, []);

  // Update PIN handler
  const handleUpdatePin = async (newPin: string): Promise<boolean> => {
    setAdminPin(newPin);
    try {
      localStorage.setItem(ADMIN_PIN_STORAGE_KEY, newPin);
    } catch (e) {
      console.warn('Failed to save PIN to localStorage:', e);
    }
    const res = await saveAdminPinToFirestore(newPin);
    return res.success || true;
  };

  // Admin Auth State (Default to false so customers opening shared links see guest view)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Main navigation tab: 'today' | 'fixed' | 'all'
  const [mainTab, setMainTab] = useState<'today' | 'fixed' | 'all'>('today');

  // Persist dishes to localStorage fallback
  useEffect(() => {
    try {
      localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(dishes));
    } catch (e) {
      console.error('Failed to save dishes to localStorage', e);
    }
  }, [dishes]);

  // Persist shop info to localStorage fallback
  useEffect(() => {
    try {
      localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(shopInfo));
    } catch (e) {
      console.error('Failed to save shop info to localStorage', e);
    }
  }, [shopInfo]);

  // Persist admin auth state
  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_AUTH_KEY, isAdminLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save admin auth state', e);
    }
  }, [isAdminLoggedIn]);

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
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isStickyRiceModalOpen, setIsStickyRiceModalOpen] = useState<boolean>(false);

  // Lock body scroll when any modal is open on mobile
  useEffect(() => {
    const isAnyModalOpen =
      !!selectedDishForDetail ||
      isAddModalOpen ||
      isShopInfoModalOpen ||
      isWeeklyOverviewModalOpen ||
      isAdminModalOpen ||
      isAuthModalOpen ||
      isStickyRiceModalOpen;

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [
    selectedDishForDetail,
    isAddModalOpen,
    isShopInfoModalOpen,
    isWeeklyOverviewModalOpen,
    isAdminModalOpen,
    isAuthModalOpen,
    isStickyRiceModalOpen,
  ]);

  // Day selection change handler
  const handleSelectDay = (day: DayOfWeek | 'today') => {
    setSelectedDay(day);
  };

  // Base Filtered dishes
  const filteredDishes = useMemo(() => {
    return filterDishes(dishes, selectedDay, selectedCategory, searchQuery, onlyAvailable, language);
  }, [dishes, selectedDay, selectedCategory, searchQuery, onlyAvailable, language]);

  // Separate dishes into 2 clear distinct sections:
  // 1. Món Hôm Nay (Daily Specials according to day or today)
  // 2. Món Cố Định (Fixed menu served all week, e.g. xôi, bánh mì, hũ làm sẵn)
  const todaySpecialDishes = useMemo(() => {
    return filteredDishes.filter((dish) => !dish.availableDays.includes('all'));
  }, [filteredDishes]);

  const fixedWeeklyDishes = useMemo(() => {
    return filteredDishes.filter((dish) => dish.availableDays.includes('all'));
  }, [filteredDishes]);

  // Counts
  const dishesCountByDay = useMemo(() => {
    return getDishesCountByDay(dishes);
  }, [dishes]);

  const categoryCounts = useMemo(() => {
    return getCategoryCounts(dishes, selectedDay);
  }, [dishes, selectedDay]);

  // Admin Auth handlers
  const handleSuccessLogin = () => {
    setIsAdminLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setIsAdminModalOpen(false);
  };

  const handleRequireAdmin = (actionCallback: () => void) => {
    if (isAdminLoggedIn) {
      actionCallback();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Handlers for dish CRUD & stock toggle
  const handleToggleStock = (dishId: string, soldOutNote?: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setDishes((prev) =>
      prev.map((dish) => {
        if (dish.id === dishId) {
          const nextState = !dish.isAvailableToday;
          const updated = {
            ...dish,
            isAvailableToday: nextState,
            soldOutNote: nextState ? undefined : (soldOutNote || dish.soldOutNote || 'Hết sớm hôm nay'),
          };
          if (selectedDishForDetail?.id === dishId) {
            setSelectedDishForDetail(updated);
          }
          // Save to Firestore
          saveDishToFirestore(updated);
          return updated;
        }
        return dish;
      })
    );
  };

  const handleResetAllToAvailable = () => {
    if (confirm('Khôi phục tất cả món ăn về trạng thái CÓ SẴN cho ngày mới?')) {
      setDishes((prev) =>
        prev.map((d) => {
          const updated = {
            ...d,
            isAvailableToday: true,
            soldOutNote: undefined,
          };
          saveDishToFirestore(updated);
          return updated;
        })
      );
    }
  };

  const handleSaveDish = async (savedDish: DishItem) => {
    // 1. Update React state immediately
    setDishes((prev) => {
      const exists = prev.some((d) => d.id === savedDish.id);
      if (exists) {
        return prev.map((d) => (d.id === savedDish.id ? savedDish : d));
      } else {
        return [savedDish, ...prev];
      }
    });

    // 2. Persist to localStorage immediately
    try {
      const updatedList = dishes.some((d) => d.id === savedDish.id)
        ? dishes.map((d) => (d.id === savedDish.id ? savedDish : d))
        : [savedDish, ...dishes];
      localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // 3. Persist to Firestore & handle quota gracefully
    const res = await saveDishToFirestore(savedDish);
    if (res.isQuotaExceeded) {
      alert('⚠️ Món ăn đã được lưu vào bộ nhớ web! (Lưu ý: Firebase Cloud hiện tạm hết hạn ngạch Quota miễn phí trong ngày, dữ liệu sẽ tự đồng bộ lên Cloud khi Firebase reset vào ngày mai).');
    }
  };

  const handleSyncAllToFirestore = async () => {
    // Combine INITIAL_DISHES and any newly added dishes in state
    const dishMap = new Map<string, DishItem>();
    INITIAL_DISHES.forEach((d) => dishMap.set(d.id, d));
    dishes.forEach((d) => dishMap.set(d.id, d));
    const fullList = Array.from(dishMap.values());

    const res = await syncAllDishesToFirestore(fullList);
    if (res.success) {
      alert(`✅ Đã đồng bộ thành công tất cả ${fullList.length} món ăn lên Firestore Cloud!`);
    } else if (res.isQuotaExceeded) {
      alert('⚠️ Firebase Cloud hiện đã đạt hạn ngạch Quota ghi miễn phí trong ngày (Free daily write limit). Dữ liệu của bạn đã được lưu an toàn tuyệt đối trên Trình Duyệt Local!');
    } else {
      alert('❌ Có lỗi khi đồng bộ lên Firebase Cloud. Vui lòng kiểm tra lại kết nối.');
    }
  };

  const handleDeleteDish = async (dishId: string) => {
    setDishes((prev) => prev.filter((d) => d.id !== dishId));
    if (selectedDishForDetail?.id === dishId) {
      setSelectedDishForDetail(null);
    }
    // Delete from Firestore
    const res = await deleteDishFromFirestore(dishId);
    if (res.isQuotaExceeded) {
      console.warn('Firebase Quota exceeded on delete. Local state updated.');
    }
  };

  const handleSaveShopInfo = async (newShopInfo: ShopInfo) => {
    setShopInfo(newShopInfo);
    const res = await saveShopInfoToFirestore(newShopInfo);
    if (res.isQuotaExceeded) {
      alert('⚠️ Thông tin quán đã lưu vào bộ nhớ web! (Firebase Cloud tạm hết Quota hôm nay).');
    }
  };

  const handleSaveStickyRiceCategory = async (newCatInfo: StickyRiceCategoryInfo) => {
    setStickyRiceCategory(newCatInfo);
    try {
      localStorage.setItem(STICKY_RICE_CAT_STORAGE_KEY, JSON.stringify(newCatInfo));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    const res = await saveStickyRiceCategoryToFirestore(newCatInfo);
    if (res.isQuotaExceeded) {
      console.warn('Firebase Quota exceeded for sticky rice category. Saved in local storage.');
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Khôi phục danh sách món ăn & thông tin quán mặc định ban đầu?')) {
      setDishes(INITIAL_DISHES);
      setShopInfo(DEFAULT_SHOP_INFO);
      localStorage.removeItem(DISHES_STORAGE_KEY);
      localStorage.removeItem(SHOP_STORAGE_KEY);
      // Re-seed Firestore
      INITIAL_DISHES.forEach((d) => saveDishToFirestore(d));
      saveShopInfoToFirestore(DEFAULT_SHOP_INFO);
    }
  };

  // Heading label & Localized texts
  const t = TRANSLATIONS[language];
  const localizedShopInfo = getLocalizedShopInfo(shopInfo, language);
  const todayLabel = getDayLabel(getTodayDayOfWeek(), language);

  // Focus search bar on mobile tab tap
  const handleFocusSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
      searchInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C05A3D]/20 selection:text-[#C05A3D] pb-16 sm:pb-0">
      {/* Editorial Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDay={selectedDay}
        setSelectedDay={handleSelectDay}
        onOpenAddModal={() => handleRequireAdmin(() => {
          setEditingDish(null);
          setIsAddModalOpen(true);
        })}
        onOpenShopInfoModal={() => setIsShopInfoModalOpen(true)}
        onOpenWeeklyOverviewModal={() => setIsWeeklyOverviewModalOpen(true)}
        onOpenAdminModal={() => handleRequireAdmin(() => setIsAdminModalOpen(true))}
        shopInfo={shopInfo}
        totalDishesCount={filteredDishes.length}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        mainTab={mainTab}
        setMainTab={setMainTab}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Day Selector (Shown when viewing today's specials or all) */}
      {(mainTab === 'today' || mainTab === 'all') && (
        <DaySelector
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          dishesCountByDay={dishesCountByDay}
          language={language}
        />
      )}

      {/* Category Pill Bar Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onlyAvailable={onlyAvailable}
        onToggleOnlyAvailable={() => setOnlyAvailable(!onlyAvailable)}
        categoryCounts={categoryCounts}
        language={language}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-8 sm:space-y-10 pb-24 sm:pb-12">
        {/* SECTION 1: MÓN ĂN HÔM NAY / THEO LỊCH TUẦN */}
        {(mainTab === 'today' || mainTab === 'all') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2.5 border-b-2 border-[#C05A3D]">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#C05A3D] animate-pulse" />
                  <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C05A3D] font-bold">
                    {t.section1Badge}
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#C05A3D]" />
                  <span>{t.section1Title} ({selectedDay === 'today' ? todayLabel : getDayLabel(selectedDay, language)})</span>
                  <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-[#C05A3D] text-white">
                    {todaySpecialDishes.length} {t.dishesUnit}
                  </span>
                </h2>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setIsWeeklyOverviewModalOpen(true)}
                  className="px-3 py-1.5 rounded-sm bg-[#F4F1EA] hover:bg-[#E5E1D8] text-[#1A1A1A] font-sans text-[11px] uppercase tracking-wider font-bold border border-black/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#C05A3D]" />
                  <span>{t.weekScheduleBtn}</span>
                </button>
              </div>
            </div>

            {todaySpecialDishes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {todaySpecialDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onSelectDish={(d) => setSelectedDishForDetail(d)}
                    onToggleStock={(id, e) => handleToggleStock(id, undefined, e)}
                    isAdmin={isAdminLoggedIn}
                    language={language}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#F4F1EA] rounded-lg p-6 text-center border border-black/10">
                <UtensilsCrossed className="w-7 h-7 text-[#C05A3D] mx-auto mb-2 opacity-60" />
                <p className="font-serif text-sm font-bold text-[#1A1A1A]">
                  {t.emptySection1Title}
                </p>
                <p className="font-sans text-[11px] text-[#1A1A1A]/60 mt-1">
                  {t.emptySection1Desc}
                </p>
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: MÓN CỐ ĐỊNH PHỤC VỤ CẢ TUẦN */}
        {(mainTab === 'fixed' || mainTab === 'all' || mainTab === 'today') && (
          <section className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2.5 border-b-2 border-[#2D463E]">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#2D463E]" />
                  <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#2D463E] font-bold">
                    {t.section2Badge}
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#2D463E]" />
                  <span>{t.section2Title}</span>
                  <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-[#2D463E] text-white">
                    {fixedWeeklyDishes.length} {t.dishesUnit}
                  </span>
                </h2>
              </div>
            </div>

            {fixedWeeklyDishes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {fixedWeeklyDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onSelectDish={(d) => setSelectedDishForDetail(d)}
                    onToggleStock={(id, e) => handleToggleStock(id, undefined, e)}
                    isAdmin={isAdminLoggedIn}
                    language={language}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#F4F1EA] rounded-lg p-6 text-center border border-black/10">
                <UtensilsCrossed className="w-7 h-7 text-[#2D463E] mx-auto mb-2 opacity-60" />
                <p className="font-serif text-sm font-bold text-[#1A1A1A]">
                  {t.emptySection2Title}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Global Empty State if both sections are empty */}
        {filteredDishes.length === 0 && (
          <div className="bg-[#F4F1EA] rounded-lg border border-black/10 p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#E5E1D8] flex items-center justify-center mx-auto mb-4 text-[#C05A3D]">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">
              {t.emptySearchTitle}
            </h3>
            <p className="font-sans text-xs text-[#1A1A1A]/70 mb-6 leading-relaxed">
              {searchQuery
                ? t.emptySearchWithQuery(searchQuery)
                : t.emptySearchGeneral}
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
                  {language === 'en' ? 'Reset Filters & Search' : 'Xoá bộ lọc & tìm kiếm'}
                </button>
              )}

              {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    setEditingDish(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-sm bg-[#C05A3D] hover:bg-[#A0452C] text-white font-sans text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.addDishBtn}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Editorial Footer with Kitchen Admin Portal */}
      <footer className="mt-auto bg-[#F4F1EA] border-t border-black/10 py-10 pb-28 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-black/10">
            {/* Col 1: Shop Brand & Address */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {shopInfo.logoUrl ? (
                  <img
                    src={shopInfo.logoUrl}
                    alt={localizedShopInfo.name}
                    className="w-8 h-8 rounded-full object-cover border border-black/10 shadow-xs shrink-0"
                  />
                ) : (
                  <span className="text-2xl">🪷</span>
                )}
                <span className="font-serif font-black text-xl uppercase tracking-tighter text-[#1A1A1A]">
                  {localizedShopInfo.name}
                </span>
              </div>
              <p className="text-xs text-[#1A1A1A]/70 font-sans leading-relaxed max-w-sm mb-3">
                {localizedShopInfo.slogan}
              </p>
              <div className="text-xs font-sans text-[#1A1A1A]/80 space-y-1">
                <p>
                  <span className="font-bold">{t.shopAddressLabel}:</span> {localizedShopInfo.address}
                </p>
                <p>
                  <span className="font-bold">{t.shopHoursLabel}:</span> {localizedShopInfo.openHours}
                </p>
              </div>
            </div>

            {/* Col 2: Customer Contact & Orders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#C05A3D]">
                  {language === 'en' ? 'Contact & Orders' : 'Liên Hệ & Đặt Món'}
                </h4>
              </div>
              <ul className="space-y-2 text-xs font-sans text-[#1A1A1A]/80">
                <li>
                  <span className="font-bold">{t.shopContactLabel}:</span> {localizedShopInfo.contactPerson}
                </li>
                <li>
                  <span className="font-bold">Hotline:</span>{' '}
                  <a
                    href={`tel:${localizedShopInfo.phone.replace(/[^0-9+]/g, '')}`}
                    className="font-bold text-[#C05A3D] hover:underline"
                  >
                    {localizedShopInfo.phone}
                  </a>
                </li>
                <li className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setIsShopInfoModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2D463E] hover:underline cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-[#C05A3D]" />
                    <span>{t.contact}</span>
                  </button>
                  <span className="opacity-30">•</span>
                  <button
                    onClick={() => setIsWeeklyOverviewModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2D463E] hover:underline cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C05A3D]" />
                    <span>{t.weekScheduleBtn}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Dedicated Kitchen & Admin Area (Mục Quản Trị Bếp) */}
            <div className="bg-[#E5E1D8]/60 p-4 sm:p-5 rounded-xl border border-black/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C05A3D]" />
                    <h4 className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
                      {language === 'en' ? 'Kitchen & Staff Area' : 'Khu Vực Bếp & Quản Trị'}
                    </h4>
                  </div>
                  {isAdminLoggedIn && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-sans flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      {language === 'en' ? 'Active' : 'Đang mở'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-sans text-[#1A1A1A]/70 leading-relaxed mb-3">
                  {language === 'en'
                    ? 'Dedicated for kitchen staff and managers to update dish availability, edit recipes and change pricing.'
                    : 'Dành riêng cho nhân viên và bếp trưởng để cập nhật món còn/hết, sửa công thức và bảng giá.'}
                </p>
              </div>

              {isAdminLoggedIn ? (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAdminModalOpen(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#2D463E] hover:bg-[#1f332d] text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E5E1D8]" />
                      <span>{t.kitchenBoardBtn}</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingDish(null);
                        setIsAddModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[#C05A3D] hover:bg-[#A0452C] text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      title={t.addDishBtn}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.addDishBtn}</span>
                    </button>
                  </div>
                  <button
                    onClick={handleLogoutAdmin}
                    className="w-full flex items-center justify-center gap-1 text-[11px] font-sans font-semibold text-red-600 hover:text-red-700 py-1 transition-colors cursor-pointer"
                  >
                    <span>{t.logout}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#1A1A1A] hover:bg-[#C05A3D] text-white text-xs font-sans font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#E5E1D8]" />
                  <span>{language === 'en' ? 'Kitchen Staff Login' : 'Đăng Nhập Quản Trị Bếp'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#1A1A1A]/50">
            <p className="flex items-center gap-1.5 flex-wrap">
              <span>{localizedShopInfo.footerNote || (language === 'en' ? `© ${new Date().getFullYear()} ${localizedShopInfo.name} • Pure & Peaceful Vegetarian Menu` : `© ${new Date().getFullYear()} ${localizedShopInfo.name} • Thực đơn món chay thanh tịnh`)}</span>
            </p>
            <p className="italic">
              {language === 'en' ? 'Purity • Serenity • Wholesome Nutrition' : 'Thanh Tịnh • An Nhiên • Dinh Dưỡng'}
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        mainTab={mainTab}
        setMainTab={setMainTab}
        onOpenSearch={handleFocusSearch}
        onOpenShopInfo={() => setIsShopInfoModalOpen(true)}
        onOpenStickyRice={() => setIsStickyRiceModalOpen(true)}
        onOpenAdmin={() => handleRequireAdmin(() => setIsAdminModalOpen(true))}
        onOpenWeeklyOverview={() => setIsWeeklyOverviewModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        todayLabel={todayLabel}
        language={language}
      />

      {/* Sticky Rice Order Modal (Mục Đặt Xôi trên Mobile Footer & Quản Lý Danh Mục/Món) */}
      <StickyRiceOrderModal
        isOpen={isStickyRiceModalOpen}
        onClose={() => setIsStickyRiceModalOpen(false)}
        dishes={dishes}
        categoryInfo={stickyRiceCategory}
        onSaveCategoryInfo={handleSaveStickyRiceCategory}
        onSaveDish={handleSaveDish}
        onDeleteDish={handleDeleteDish}
        onToggleStock={(id) => handleToggleStock(id)}
        onOpenAddDishModal={(dish) => {
          setEditingDish(dish || null);
          setIsAddModalOpen(true);
        }}
        shopInfo={shopInfo}
        language={language}
      />

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
        isAdmin={isAdminLoggedIn}
        onRequireAdminLogin={() => setIsAuthModalOpen(true)}
        language={language}
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
        shopInfo={shopInfo}
        onSaveShopInfo={handleSaveShopInfo}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminModal={() => {
          setIsShopInfoModalOpen(false);
          setIsAdminModalOpen(true);
        }}
        onOpenAuthModal={() => {
          setIsShopInfoModalOpen(false);
          setIsAuthModalOpen(true);
        }}
        language={language}
      />

      {/* Weekly Overview Modal */}
      <WeeklyOverviewModal
        isOpen={isWeeklyOverviewModalOpen}
        onClose={() => setIsWeeklyOverviewModalOpen(false)}
        dishes={dishes}
        onSelectDay={(day) => handleSelectDay(day)}
        language={language}
      />

      {/* Admin Center Control Panel Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        dishes={dishes}
        onToggleStock={(id, note) => handleToggleStock(id, note)}
        onEditDish={(dish) => {
          setIsAdminModalOpen(false);
          setEditingDish(dish);
          setIsAddModalOpen(true);
        }}
        onAddNewDish={() => {
          setIsAdminModalOpen(false);
          setEditingDish(null);
          setIsAddModalOpen(true);
        }}
        onDeleteDish={handleDeleteDish}
        onResetAllToAvailable={handleResetAllToAvailable}
        onSyncAllToFirestore={handleSyncAllToFirestore}
        shopInfo={shopInfo}
        onSaveShopInfo={handleSaveShopInfo}
        onResetShopInfo={() => handleSaveShopInfo(DEFAULT_SHOP_INFO)}
        currentPin={adminPin}
        onUpdatePin={handleUpdatePin}
      />

      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleSuccessLogin}
        currentPin={adminPin}
        language={language}
      />
    </div>
  );
}

