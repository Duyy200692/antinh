import React from 'react';
import { X, Phone, MapPin, Clock, ShieldCheck, Info } from 'lucide-react';
import { SHOP_INFO as DEFAULT_SHOP_INFO } from '../data/mockDishes';
import { ShopInfo, Language } from '../types';
import { TRANSLATIONS, getLocalizedShopInfo } from '../utils/i18n';

interface ShopInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopInfo?: ShopInfo;
  onSaveShopInfo?: (info: ShopInfo) => void;
  onOpenAdminModal?: () => void;
  isAdminLoggedIn?: boolean;
  onOpenAuthModal?: () => void;
  language?: Language;
}

export const ShopInfoModal: React.FC<ShopInfoModalProps> = ({
  isOpen,
  onClose,
  shopInfo = DEFAULT_SHOP_INFO,
  onOpenAdminModal,
  isAdminLoggedIn = false,
  language = 'vi' as Language,
}) => {
  const t = TRANSLATIONS[language];
  const localizedInfo = getLocalizedShopInfo(shopInfo, language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FDFCFB] text-[#1A1A1A] rounded-lg max-w-xl w-full border border-black/10 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#F4F1EA] px-6 py-5 border-b border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#E5E1D8] flex items-center justify-center text-[#C05A3D] text-lg font-bold overflow-hidden border border-black/10 shrink-0">
              {shopInfo.logoUrl ? (
                <img src={shopInfo.logoUrl} alt={localizedInfo.name} className="w-full h-full object-cover" />
              ) : (
                <span>🪷</span>
              )}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-[#1A1A1A]">
                {localizedInfo.name}
              </h2>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C05A3D] font-bold">
                {t.shopInfoSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm bg-[#E5E1D8] hover:bg-[#D9D1C2] flex items-center justify-center text-[#1A1A1A] transition-colors cursor-pointer"
            aria-label={t.closeBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Intro notice */}
          <div className="bg-[#F4F1EA] p-4 rounded-sm border-l-2 border-[#C05A3D] flex items-start gap-3">
            <Info className="w-5 h-5 text-[#C05A3D] shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-[#1A1A1A]/80 font-sans">
              {localizedInfo.slogan}
            </p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F4F1EA] rounded-sm border border-black/5">
              <div className="flex items-center gap-2 mb-2 text-xs font-sans uppercase tracking-wider font-bold text-[#C05A3D]">
                <Clock className="w-4 h-4" />
                <span>{t.shopHoursLabel}</span>
              </div>
              <p className="text-sm font-serif font-bold text-[#1A1A1A]">{localizedInfo.openHours}</p>
              <p className="text-xs text-[#1A1A1A]/60 mt-1">
                {language === 'en' ? 'Serving Monday - Sunday' : 'Phục vụ các ngày từ Thứ 2 - Chủ Nhật'}
              </p>
            </div>

            <div className="p-4 bg-[#F4F1EA] rounded-sm border border-black/5">
              <div className="flex items-center gap-2 mb-2 text-xs font-sans uppercase tracking-wider font-bold text-[#2D463E]">
                <Phone className="w-4 h-4" />
                <span>{t.shopContactLabel}</span>
              </div>
              <p className="text-sm font-serif font-bold text-[#1A1A1A]">{localizedInfo.contactPerson}</p>
              <p className="text-xs text-[#1A1A1A]/80 font-mono mt-1">{t.phonePrefix}: {localizedInfo.phone}</p>
            </div>
          </div>

          {/* Address */}
          <div className="p-4 bg-[#F4F1EA] rounded-sm border border-black/5 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#C05A3D] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-sans uppercase tracking-wider font-bold text-[#1A1A1A] mb-1">
                {t.shopAddressLabel}
              </h3>
              <p className="text-sm text-[#1A1A1A]/80 font-serif">{localizedInfo.address}</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="border-t border-black/10 pt-4 space-y-3">
            <h3 className="font-serif font-bold text-base text-[#1A1A1A] uppercase tracking-wide">
              {t.shopHighlightsLabel}
            </h3>

            <div className="space-y-2 text-xs text-[#1A1A1A]/80">
              {localizedInfo.features && localizedInfo.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2D463E] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F4F1EA] px-6 py-4 border-t border-black/10 flex items-center justify-between">
          {isAdminLoggedIn && onOpenAdminModal ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdminModal();
              }}
              className="text-xs text-[#C05A3D] hover:underline font-sans font-semibold cursor-pointer"
            >
              {language === 'en' ? 'Edit details in Kitchen Admin →' : 'Chỉnh sửa thông tin trong Bảng Quản Trị Bếp →'}
            </button>
          ) : (
            <span />
          )}

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-sm bg-[#1A1A1A] hover:bg-[#2D463E] text-white font-sans uppercase tracking-wider font-bold text-xs transition-colors cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
