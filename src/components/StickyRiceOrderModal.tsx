import React, { useState, useEffect } from 'react';
import {
  X,
  Wheat,
  Phone,
  Clock,
  Sparkles,
  Edit3,
  Save,
  PlusCircle,
  Trash2,
  CheckCircle2,
  MessageCircle,
  UtensilsCrossed,
} from 'lucide-react';
import { DishItem, StickyRiceCategoryInfo, ShopInfo, Language } from '../types';
import { DEFAULT_STICKY_RICE_CATEGORY_INFO } from '../data/mockDishes';

interface StickyRiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: DishItem[];
  categoryInfo?: StickyRiceCategoryInfo;
  onSaveCategoryInfo: (info: StickyRiceCategoryInfo) => void;
  onSaveDish: (dish: DishItem) => void;
  onDeleteDish: (dishId: string) => void;
  onToggleStock: (dishId: string) => void;
  onOpenAddDishModal: (initialDish?: DishItem | null) => void;
  shopInfo?: ShopInfo;
  language?: Language;
}

export const StickyRiceOrderModal: React.FC<StickyRiceOrderModalProps> = ({
  isOpen,
  onClose,
  dishes,
  categoryInfo = DEFAULT_STICKY_RICE_CATEGORY_INFO,
  onSaveCategoryInfo,
  onSaveDish,
  onDeleteDish,
  onToggleStock,
  onOpenAddDishModal,
  shopInfo,
  language = 'vi',
}) => {
  // Category Edit State
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [catTitle, setCatTitle] = useState(categoryInfo.title);
  const [catSubtitle, setCatSubtitle] = useState(categoryInfo.subtitle);
  const [catDescription, setCatDescription] = useState(categoryInfo.description);
  const [catHotline, setCatHotline] = useState(categoryInfo.hotline || shopInfo?.phone || '0909 310 567');
  const [catZalo, setCatZalo] = useState(categoryInfo.zalo || shopInfo?.phone || '0909 310 567');
  const [catOrderNotice, setCatOrderNotice] = useState(categoryInfo.orderNotice);
  const [catMinimumLeadTime, setCatMinimumLeadTime] = useState(categoryInfo.minimumLeadTime);
  const [catCateringNote, setCatCateringNote] = useState(categoryInfo.cateringNote);
  const [categorySavedSuccess, setCategorySavedSuccess] = useState(false);

  // Sync category fields when categoryInfo prop updates
  useEffect(() => {
    setCatTitle(categoryInfo.title);
    setCatSubtitle(categoryInfo.subtitle);
    setCatDescription(categoryInfo.description);
    setCatHotline(categoryInfo.hotline || shopInfo?.phone || '0909 310 567');
    setCatZalo(categoryInfo.zalo || shopInfo?.phone || '0909 310 567');
    setCatOrderNotice(categoryInfo.orderNotice);
    setCatMinimumLeadTime(categoryInfo.minimumLeadTime);
    setCatCateringNote(categoryInfo.cateringNote);
  }, [categoryInfo, shopInfo]);

  // Dish Quick Inline Edit State
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editDishName, setEditDishName] = useState('');
  const [editDishPrice, setEditDishPrice] = useState('');
  const [editDishUnit, setEditDishUnit] = useState('');
  const [editDishDesc, setEditDishDesc] = useState('');
  const [editDishPrepTime, setEditDishPrepTime] = useState('');
  const [editDishImage, setEditDishImage] = useState('');
  const [editDishAvail, setEditDishAvail] = useState(true);
  const [editDishStatusBadge, setEditDishStatusBadge] = useState('');

  // Customer order quantities state (e.g. { 'xoi-01': 2 })
  const [orderCart, setOrderCart] = useState<Record<string, number>>({});
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Sticky rice presets for quick image selection when adding/editing
  const STICKY_RICE_IMAGE_PRESETS = [
    { label: 'Xôi Bắp Hoa Vàng', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80' },
    { label: 'Xôi Vò Đậu Xanh', url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80' },
    { label: 'Xôi Khúc Thảo Mộc', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80' },
    { label: 'Xôi Gấc Đỏ May Mắn', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Bánh Mì Xôi Chay', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80' },
  ];

  if (!isOpen) return null;

  // Filter sticky rice & bread dishes (category === 'sticky_rice_bread' or name contains 'xôi' or 'xoi')
  const stickyRiceDishes = dishes.filter(
    (d) =>
      d.category === 'sticky_rice_bread' ||
      d.name.toLowerCase().includes('xôi') ||
      d.name.toLowerCase().includes('xoi')
  );

  // Handle Save Category Info
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StickyRiceCategoryInfo = {
      title: catTitle.trim() || DEFAULT_STICKY_RICE_CATEGORY_INFO.title,
      subtitle: catSubtitle.trim() || DEFAULT_STICKY_RICE_CATEGORY_INFO.subtitle,
      description: catDescription.trim() || DEFAULT_STICKY_RICE_CATEGORY_INFO.description,
      hotline: catHotline.trim() || '0909 310 567',
      zalo: catZalo.trim() || '0909 310 567',
      orderNotice: catOrderNotice.trim() || DEFAULT_STICKY_RICE_CATEGORY_INFO.orderNotice,
      minimumLeadTime: catMinimumLeadTime.trim() || DEFAULT_STICKY_RICE_CATEGORY_INFO.minimumLeadTime,
      cateringNote: catCateringNote.trim() || DEFAULT_STICKY_RICE_CATEGORY_INFO.cateringNote,
    };
    onSaveCategoryInfo(updated);
    setIsEditingCategory(false);
    setCategorySavedSuccess(true);
    setTimeout(() => setCategorySavedSuccess(false), 3000);
  };

  // Start inline editing a dish
  const handleStartEditDish = (dish: DishItem) => {
    setEditingDishId(dish.id);
    setEditDishName(dish.name);
    setEditDishPrice(dish.price);
    setEditDishUnit(dish.unit || 'Phần');
    setEditDishDesc(dish.description || '');
    setEditDishPrepTime(dish.prepTime || '5 phút');
    setEditDishImage(dish.image);
    setEditDishAvail(dish.isAvailableToday);
    setEditDishStatusBadge(dish.orderStatusBadge || 'Chỉ nhận đặt số lượng lớn (từ 10 phần)');
  };

  // Save inline edited dish
  const handleSaveInlineDish = (originalDish: DishItem) => {
    const updatedDish: DishItem = {
      ...originalDish,
      name: editDishName.trim() || originalDish.name,
      price: editDishPrice.trim() || originalDish.price,
      unit: editDishUnit.trim() || originalDish.unit,
      description: editDishDesc.trim() || originalDish.description,
      prepTime: editDishPrepTime.trim() || originalDish.prepTime,
      image: editDishImage.trim() || originalDish.image,
      isAvailableToday: editDishAvail,
      orderStatusBadge: editDishStatusBadge.trim(),
      bulkOrderOnly: true,
    };
    onSaveDish(updatedDish);
    setEditingDishId(null);
  };

  // Handle Add New Sticky Rice Dish (Quick add or open full modal)
  const handleAddNewDish = () => {
    onClose();
    onOpenAddDishModal({
      id: `xoi-${Date.now()}`,
      name: 'Món Xôi Mới',
      description: 'Nếp cái hoa vàng dẻo thơm nấu tươi hàng ngày kết hợp chà bông nấm và đậu xanh bùi béo.',
      price: '25.000đ',
      unit: 'Phần',
      category: 'sticky_rice_bread',
      availableDays: ['all'],
      image: STICKY_RICE_IMAGE_PRESETS[0].url,
      isAvailableToday: true,
      tags: ['Xôi Chay', 'Nếp Cái Hoa Vàng'],
      prepTime: '5 phút (nhận đặt sỉ)',
    });
  };

  // Handle Order Quantity changes
  const updateQuantity = (dishId: string, delta: number) => {
    setOrderCart((prev) => {
      const current = prev[dishId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[dishId];
        return copy;
      }
      return { ...prev, [dishId]: next };
    });
  };

  // Calculate Cart Total
  const cartItemCount: number = (Object.values(orderCart) as number[]).reduce((sum: number, q: number) => sum + q, 0);

  const calculateCartTotal = (): number => {
    return (Object.entries(orderCart) as [string, number][]).reduce((total: number, [dishId, qty]: [string, number]) => {
      const dish = stickyRiceDishes.find((d) => d.id === dishId);
      if (!dish) return total;
      const numericPrice = parseInt(dish.price.replace(/[^0-9]/g, ''), 10) || 0;
      return total + numericPrice * Number(qty);
    }, 0);
  };

  const handleCopyHotline = () => {
    const phone = catHotline.replace(/[^0-9+]/g, '');
    navigator.clipboard?.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  // Generate Zalo order message
  const handleSendZaloOrder = () => {
    const phone = catZalo.replace(/[^0-9+]/g, '');
    const itemsList = Object.entries(orderCart)
      .map(([dishId, qty]) => {
        const dish = stickyRiceDishes.find((d) => d.id === dishId);
        return dish ? `- ${qty}x ${dish.name} (${dish.price}/${dish.unit})` : '';
      })
      .filter(Boolean)
      .join('\n');

    const totalStr = calculateCartTotal().toLocaleString('vi-VN') + 'đ';
    const message = `Xin chào Quán An Tịnh, tôi muốn đặt xôi:\n${itemsList}\nTổng tạm tính: ${totalStr}\nNhờ quán xác nhận giúp tôi nhé!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://zalo.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#FDFCFB] text-[#1A1A1A] rounded-xl max-w-4xl w-full border border-black/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#1A1A1A] text-[#FDFCFB] px-4 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C05A3D]/20 border border-[#C05A3D]/40 flex items-center justify-center text-[#C05A3D] shrink-0">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#C05A3D] text-white">
                  ĐẶT XÔI & XÔI CHAY
                </span>
                <span className="text-[10px] font-sans text-white/60 hidden sm:inline">
                  {stickyRiceDishes.length} món phục vụ mỗi ngày
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-tight text-white mt-0.5 line-clamp-1">
                {catTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingCategory(!isEditingCategory)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isEditingCategory
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
              title="Chỉnh sửa thông tin danh mục"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isEditingCategory ? 'Đang sửa danh mục' : 'Sửa danh mục'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {categorySavedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-sans font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã lưu và cập nhật thành công thông tin danh mục Đặt Xôi!</span>
            </div>
          )}

          {/* 1. Category Information Section */}
          <div className="bg-[#F4F1EA] rounded-xl border border-black/10 p-4 sm:p-5 shadow-xs">
            {!isEditingCategory ? (
              // Display Category Information
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-tight text-[#1A1A1A]">
                      {catTitle}
                    </h3>
                    <p className="text-xs font-sans font-bold text-[#C05A3D] uppercase tracking-wider mt-0.5">
                      {catSubtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditingCategory(true)}
                    className="self-start px-3 py-1.5 rounded-lg bg-[#C05A3D]/10 hover:bg-[#C05A3D]/20 text-[#C05A3D] text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#C05A3D]/20"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa thông tin danh mục</span>
                  </button>
                </div>

                <p className="text-xs sm:text-[13px] leading-relaxed text-[#1A1A1A]/80 font-sans">
                  {catDescription}
                </p>

                {/* Key Badges & Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-sans">
                  <div className="bg-white/80 p-3 rounded-lg border border-black/5 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#C05A3D] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#1A1A1A] block">Thời gian chuẩn bị:</span>
                      <span className="text-[#1A1A1A]/70 text-[11px]">{catMinimumLeadTime}</span>
                    </div>
                  </div>

                  <div className="bg-white/80 p-3 rounded-lg border border-black/5 flex items-start gap-2">
                    <Phone className="w-4 h-4 text-[#2D463E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#1A1A1A] block">Hotline / Zalo đặt xôi:</span>
                      <a href={`tel:${catHotline.replace(/[^0-9+]/g, '')}`} className="text-[#C05A3D] font-bold text-[11px] hover:underline">
                        {catHotline}
                      </a>
                    </div>
                  </div>

                  <div className="bg-white/80 p-3 rounded-lg border border-black/5 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#1A1A1A] block">Đặt tiệc & cúng rằm:</span>
                      <span className="text-[#1A1A1A]/70 text-[11px]">{catCateringNote}</span>
                    </div>
                  </div>
                </div>

                {catOrderNotice && (
                  <div className="bg-amber-50 border-l-3 border-amber-500 p-2.5 rounded-r-lg text-[11px] text-amber-900 font-sans">
                    💡 <span className="font-bold">Lưu ý:</span> {catOrderNotice}
                  </div>
                )}
              </div>
            ) : (
              // Form to Edit Category Information
              <form onSubmit={handleSaveCategory} className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-black/10">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#C05A3D]" />
                    <h4 className="font-serif text-base font-bold uppercase tracking-tight text-[#1A1A1A]">
                      Chỉnh Sửa Thông Tin Danh Mục Đặt Xôi
                    </h4>
                  </div>
                  <span className="text-[11px] font-sans text-[#1A1A1A]/60">
                    Cập nhật hiển thị cho khách hàng
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Tên danh mục:
                    </label>
                    <input
                      type="text"
                      value={catTitle}
                      onChange={(e) => setCatTitle(e.target.value)}
                      placeholder="VD: Chuyên Mục Đặt Xôi & Xôi Chay An Tịnh"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/20 text-xs font-sans focus:outline-hidden focus:ring-2 focus:ring-[#C05A3D]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Phụ đề / Khẩu hiệu:
                    </label>
                    <input
                      type="text"
                      value={catSubtitle}
                      onChange={(e) => setCatSubtitle(e.target.value)}
                      placeholder="VD: Nếp Cái Hoa Vàng Chuẩn Vị Bắc • Nhận Đặt Tiệc, Cúng Rằm"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/20 text-xs font-sans focus:outline-hidden focus:ring-2 focus:ring-[#C05A3D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Giới thiệu & mô tả danh mục:
                    </label>
                    <textarea
                      rows={3}
                      value={catDescription}
                      onChange={(e) => setCatDescription(e.target.value)}
                      placeholder="Mô tả nguyên liệu nếp cái hoa vàng, đặc trưng hương vị xôi chay..."
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/20 text-xs font-sans focus:outline-hidden focus:ring-2 focus:ring-[#C05A3D] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Hotline đặt xôi:
                    </label>
                    <input
                      type="text"
                      value={catHotline}
                      onChange={(e) => setCatHotline(e.target.value)}
                      placeholder="VD: 0909 310 567"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/20 text-xs font-sans focus:outline-hidden focus:ring-2 focus:ring-[#C05A3D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Số Zalo nhận đơn:
                    </label>
                    <input
                      type="text"
                      value={catZalo}
                      onChange={(e) => setCatZalo(e.target.value)}
                      placeholder="VD: 0909 310 567"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/20 text-xs font-sans focus:outline-hidden focus:ring-2 focus:ring-[#C05A3D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Thời gian chuẩn bị / nhận đơn:
                    </label>
                    <input
                      type="text"
                      value={catMinimumLeadTime}
                      onChange={(e) => setCatMinimumLeadTime(e.target.value)}
                      placeholder="VD: Đặt trước 30-60 phút cho đơn lẻ, hoặc trước 1 ngày cho tiệc lớn"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/20 text-xs font-sans focus:outline-hidden focus:ring-2 focus:ring-[#C05A3D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Chính sách đặt tiệc & cúng rằm:
                    </label>
                    <input
                      type="text"
                      value={catCateringNote}
                      onChange={(e) => setCatCateringNote(e.target.value)}
                      placeholder="VD: Hỗ trợ đóng hộp lá chuối, chiết khấu từ 20 phần"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/20 text-xs font-sans focus:outline-hidden focus:ring-2 focus:ring-[#C05A3D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Ghi chú / Thông báo đặt hàng:
                    </label>
                    <input
                      type="text"
                      value={catOrderNotice}
                      onChange={(e) => setCatOrderNotice(e.target.value)}
                      placeholder="VD: Nhận đặt xôi ăn sáng và đám tiệc, giao hàng tận nơi"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/20 text-xs font-sans focus:outline-hidden focus:ring-2 focus:ring-[#C05A3D]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
                  <button
                    type="button"
                    onClick={() => setIsEditingCategory(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs font-sans font-bold transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#C05A3D] hover:bg-[#A0452C] text-white text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu thông tin danh mục</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 2. Sticky Rice Dishes List Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b-2 border-[#C05A3D]">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-[#C05A3D]" />
                <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-tight text-[#1A1A1A]">
                  Danh Sách Món Xôi Chay ({stickyRiceDishes.length} món)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddNewDish}
                  className="px-3.5 py-1.5 rounded-lg bg-[#2D463E] hover:bg-[#1f332d] text-white text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Món Xôi Mới</span>
                </button>
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stickyRiceDishes.map((dish) => {
                const isEditingThis = editingDishId === dish.id;
                const currentQty = orderCart[dish.id] || 0;

                return (
                  <div
                    key={dish.id}
                    className={`rounded-xl border transition-all overflow-hidden bg-white shadow-xs ${
                      dish.isAvailableToday ? 'border-black/10' : 'border-red-200 bg-red-50/20'
                    }`}
                  >
                    {!isEditingThis ? (
                      // Dish View Card
                      <div className="p-4 flex flex-col justify-between h-full space-y-3">
                        <div className="flex gap-3.5">
                          {/* Image */}
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 bg-[#E5E1D8] border border-black/10">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className={`w-full h-full object-cover transition-transform duration-300 ${
                                !dish.isAvailableToday ? 'grayscale opacity-75' : ''
                              }`}
                              loading="lazy"
                            />
                            <div className="absolute top-1 left-1">
                              {dish.isAvailableToday ? (
                                <span className="px-1.5 py-0.5 rounded-sm bg-emerald-600/90 text-white text-[9px] font-sans font-bold uppercase">
                                  Có sẵn
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-sm bg-red-600/90 text-white text-[9px] font-sans font-bold uppercase">
                                  Tạm hết
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-1">
                                <h4 className="font-serif text-base font-bold text-[#1A1A1A] line-clamp-2 leading-snug">
                                  {dish.name}
                                </h4>
                              </div>

                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="font-mono text-sm sm:text-base font-bold text-[#C05A3D]">
                                  {dish.price}
                                </span>
                                <span className="text-[11px] text-[#1A1A1A]/60 font-sans">
                                  / {dish.unit || 'Phần'}
                                </span>
                              </div>

                              <p className="text-[11px] text-[#1A1A1A]/70 line-clamp-2 mt-1 leading-relaxed">
                                {dish.description}
                              </p>

                              {dish.orderStatusBadge && (
                                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-sans font-bold">
                                  <span>📦 {dish.orderStatusBadge}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1 text-[10px] text-[#1A1A1A]/60 font-sans">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#C05A3D]" />
                                {dish.prepTime || '5 phút'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Controls: Edit dish, Toggle stock, and Quick Order quantity */}
                        <div className="pt-2 border-t border-black/5 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {/* Stock Toggle Button */}
                            <button
                              onClick={() => onToggleStock(dish.id)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-sans font-bold transition-colors cursor-pointer ${
                                dish.isAvailableToday
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                              title="Bật/Tắt còn hàng"
                            >
                              {dish.isAvailableToday ? '✓ Đang có sẵn' : '✕ Báo tạm hết'}
                            </button>

                            {/* Edit Dish Button */}
                            <button
                              onClick={() => handleStartEditDish(dish)}
                              className="px-2.5 py-1 rounded-md bg-[#F4F1EA] hover:bg-[#E5E1D8] text-[#1A1A1A] text-[11px] font-sans font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Chỉnh sửa thông tin món này"
                            >
                              <Edit3 className="w-3 h-3 text-[#C05A3D]" />
                              <span>Sửa món</span>
                            </button>

                            {/* Delete Dish Button */}
                            <button
                              onClick={() => {
                                if (confirm(`Xác nhận xóa món "${dish.name}" khỏi danh mục đặt xôi?`)) {
                                  onDeleteDish(dish.id);
                                }
                              }}
                              className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Xóa món này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Quick Order Quantity Counter */}
                          <div className="flex items-center gap-1 bg-[#F4F1EA] p-0.5 rounded-lg border border-black/10">
                            <button
                              onClick={() => updateQuantity(dish.id, -1)}
                              disabled={currentQty === 0}
                              className="w-6 h-6 rounded-md bg-white hover:bg-gray-100 disabled:opacity-40 text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold font-mono text-[#1A1A1A]">
                              {currentQty}
                            </span>
                            <button
                              onClick={() => updateQuantity(dish.id, 1)}
                              className="w-6 h-6 rounded-md bg-[#C05A3D] text-white hover:bg-[#A0452C] text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Dish Quick Edit Form inside Card
                      <div className="p-4 bg-amber-50/40 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between pb-1.5 border-b border-black/10">
                          <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#C05A3D] flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5" />
                            Chỉnh Sửa Món Xôi
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingDishId(null)}
                            className="text-xs text-gray-500 hover:text-black font-sans cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>

                        <div className="space-y-2.5 text-xs font-sans">
                          <div>
                            <label className="block font-bold text-[#1A1A1A] mb-0.5">Tên món xôi:</label>
                            <input
                              type="text"
                              value={editDishName}
                              onChange={(e) => setEditDishName(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-md bg-white border border-black/20 focus:ring-1 focus:ring-[#C05A3D] text-xs font-serif font-bold"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold text-[#1A1A1A] mb-0.5">Giá bán:</label>
                              <input
                                type="text"
                                value={editDishPrice}
                                onChange={(e) => setEditDishPrice(e.target.value)}
                                placeholder="25.000đ"
                                className="w-full px-2.5 py-1.5 rounded-md bg-white border border-black/20 focus:ring-1 focus:ring-[#C05A3D] text-xs font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-[#1A1A1A] mb-0.5">Đơn vị:</label>
                              <input
                                type="text"
                                value={editDishUnit}
                                onChange={(e) => setEditDishUnit(e.target.value)}
                                placeholder="Phần, Hộp..."
                                className="w-full px-2.5 py-1.5 rounded-md bg-white border border-black/20 focus:ring-1 focus:ring-[#C05A3D] text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-[#1A1A1A] mb-0.5">Mô tả món ăn:</label>
                            <textarea
                              rows={2}
                              value={editDishDesc}
                              onChange={(e) => setEditDishDesc(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-md bg-white border border-black/20 focus:ring-1 focus:ring-[#C05A3D] text-xs leading-relaxed"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold text-[#1A1A1A] mb-0.5">Thời gian chuẩn bị:</label>
                              <input
                                type="text"
                                value={editDishPrepTime}
                                onChange={(e) => setEditDishPrepTime(e.target.value)}
                                placeholder="5 phút"
                                className="w-full px-2.5 py-1.5 rounded-md bg-white border border-black/20 focus:ring-1 focus:ring-[#C05A3D] text-xs"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-[#1A1A1A] mb-0.5">Trạng thái:</label>
                              <select
                                value={editDishAvail ? 'true' : 'false'}
                                onChange={(e) => setEditDishAvail(e.target.value === 'true')}
                                className="w-full px-2.5 py-1.5 rounded-md bg-white border border-black/20 focus:ring-1 focus:ring-[#C05A3D] text-xs font-bold"
                              >
                                <option value="true">Đang có sẵn</option>
                                <option value="false">Tạm hết</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-[#1A1A1A] mb-0.5">Trạng thái đặt hàng / Số lượng lớn:</label>
                            <input
                              type="text"
                              value={editDishStatusBadge}
                              onChange={(e) => setEditDishStatusBadge(e.target.value)}
                              placeholder="VD: Chỉ nhận đặt số lượng lớn (từ 10 phần)"
                              className="w-full px-2.5 py-1.5 rounded-md bg-white border border-black/20 focus:ring-1 focus:ring-[#C05A3D] text-xs font-semibold text-amber-900"
                            />
                            {/* Quick Status Presets for Pre-ordered / Bulk items */}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              <span className="text-[10px] text-gray-500 self-center">Gợi ý trạng thái đặt trước:</span>
                              {[
                                'Chỉ nhận đặt số lượng lớn (từ 10 phần)',
                                'Cần đặt trước (trước 1 ngày)',
                                'Nhận đặt tiệc & cúng rằm',
                                'Mở đơn đặt ăn sáng hàng ngày',
                              ].map((preset, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setEditDishStatusBadge(preset)}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold cursor-pointer transition-colors"
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-[#1A1A1A] mb-0.5">Link ảnh món (URL):</label>
                            <input
                              type="text"
                              value={editDishImage}
                              onChange={(e) => setEditDishImage(e.target.value)}
                              placeholder="https://..."
                              className="w-full px-2.5 py-1.5 rounded-md bg-white border border-black/20 focus:ring-1 focus:ring-[#C05A3D] text-xs font-mono"
                            />
                            {/* Quick Presets */}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              <span className="text-[10px] text-gray-500 self-center">Chọn ảnh mẫu:</span>
                              {STICKY_RICE_IMAGE_PRESETS.map((p, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setEditDishImage(p.url)}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
                            <button
                              type="button"
                              onClick={() => setEditingDishId(null)}
                              className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-xs font-bold cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveInlineDish(dish)}
                              className="px-4 py-1.5 rounded-md bg-[#C05A3D] hover:bg-[#A0452C] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Lưu Món</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {stickyRiceDishes.length === 0 && (
              <div className="bg-[#F4F1EA] rounded-xl p-8 text-center border border-black/10">
                <Wheat className="w-8 h-8 text-[#C05A3D] mx-auto mb-2 opacity-60" />
                <p className="font-serif text-base font-bold text-[#1A1A1A]">
                  Chưa có món xôi nào trong danh mục
                </p>
                <p className="text-xs text-[#1A1A1A]/60 mt-1">
                  Hãy bấm nút &quot;Thêm Món Xôi Mới&quot; ở trên để bắt đầu thêm món vào thực đơn đặt xôi.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Order & Action Bar */}
        <div className="bg-[#F4F1EA] px-4 sm:px-6 py-3.5 border-t border-black/10 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Cart summary if items selected */}
            <div className="w-full sm:w-auto">
              {cartItemCount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-sans font-bold text-[#1A1A1A]">
                    Đã chọn: <span className="text-[#C05A3D]">{cartItemCount} phần xôi</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#2D463E] bg-white px-2 py-0.5 rounded-md border border-black/10">
                    Tạm tính: {calculateCartTotal().toLocaleString('vi-VN')}đ
                  </span>
                  <button
                    onClick={() => setOrderCart({})}
                    className="text-[11px] text-gray-500 hover:text-red-600 underline font-sans ml-1 cursor-pointer"
                  >
                    Xóa chọn
                  </button>
                </div>
              ) : (
                <div className="text-xs font-sans text-[#1A1A1A]/70 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C05A3D]" />
                  <span>
                    Hotline đặt xôi: <strong className="text-[#C05A3D]">{catHotline}</strong>
                  </span>
                  <button
                    onClick={handleCopyHotline}
                    className="text-[10px] text-gray-500 hover:text-black underline ml-1 cursor-pointer"
                  >
                    {copiedPhone ? '✓ Đã sao chép' : 'Sao chép'}
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {cartItemCount > 0 ? (
                <button
                  onClick={handleSendZaloOrder}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#0068FF] hover:bg-[#0052cc] text-white text-xs font-sans font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Gửi Đơn Qua Zalo</span>
                </button>
              ) : null}

              <a
                href={`tel:${catHotline.replace(/[^0-9+]/g, '')}`}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#C05A3D] hover:bg-[#A0452C] text-white text-xs font-sans font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi Đặt Xôi ({catHotline})</span>
              </a>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs font-sans font-bold transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
