import React from 'react';
import { Phone, MessageCircle, Sparkles, Clock, ShieldCheck, HeartHandshake, Award, PlusCircle } from 'lucide-react';
import { Language, ShopInfo } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface BulkStickyRiceBannerProps {
  shopInfo: ShopInfo;
  language?: Language;
  onExploreDishes?: () => void;
  onAddNewDish?: () => void;
  isAdmin?: boolean;
}

export const BulkStickyRiceBanner: React.FC<BulkStickyRiceBannerProps> = ({
  shopInfo,
  language = 'vi',
  onExploreDishes,
  onAddNewDish,
  isAdmin = false,
}) => {
  const t = TRANSLATIONS[language];
  const cleanPhone = shopInfo.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#F4F1EA] via-[#FDFCFB] to-[#F4F1EA] border-2 border-[#C05A3D]/30 p-5 sm:p-7 shadow-sm">
      {/* Decorative Traditional Corner Motifs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C05A3D]/5 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#2D463E]/5 rounded-tr-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Heading & Value Proposition */}
        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C05A3D]/10 border border-[#C05A3D]/20 text-[#C05A3D] text-[11px] font-sans font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.bulkStickyRiceBadge}</span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-[#1A1A1A]">
            {t.bulkStickyRiceTitle}
          </h2>

          <p className="text-xs sm:text-sm font-sans text-[#1A1A1A]/80 leading-relaxed max-w-2xl">
            {language === 'en'
              ? 'Crafted from 100% authentic Northern Golden Flower glutinous rice. Naturally colored with fresh botanicals (gac, magenta leaves, gardenia, pandan). Molded with festive auspicious motifs or packed in event boxes. Punctual hot delivery for your rituals and ceremonies.'
              : 'Nấu từ 100% nếp cái hoa vàng chuẩn vị Bắc thơm dẻo 12 tiếng. Lên màu tự nhiên hoàn toàn từ thảo mộc (gấc tươi, lá cẩm, dành dành, lá dứa). Ép khuôn chữ Hỷ, Phúc - Lộc - Thọ trang nghiêm hoặc chia hộp kraft tiện lợi. Giao nóng tận nơi đúng giờ cúng.'}
          </p>

          {/* 4 Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-2.5 rounded-lg bg-white/80 border border-black/5 flex items-start gap-2">
              <Award className="w-4 h-4 text-[#C05A3D] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-sans font-bold text-[#1A1A1A]">100% Nếp Cái Hoa Vàng</p>
                <p className="text-[10px] text-[#1A1A1A]/60">Dẻo thơm 12h, không lại gạo</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white/80 border border-black/5 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D463E] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-sans font-bold text-[#1A1A1A]">100% Màu Tự Nhiên</p>
                <p className="text-[10px] text-[#1A1A1A]/60">Gấc, lá cẩm, không phẩm màu</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white/80 border border-black/5 flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#C05A3D] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-sans font-bold text-[#1A1A1A]">Giao Đúng Giờ Cúng</p>
                <p className="text-[10px] text-[#1A1A1A]/60">Xôi nóng hổi, chuẩn giờ hoàng đạo</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white/80 border border-black/5 flex items-start gap-2">
              <HeartHandshake className="w-4 h-4 text-[#2D463E] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-sans font-bold text-[#1A1A1A]">Chiết Khấu Đặt Nhiều</p>
                <p className="text-[10px] text-[#1A1A1A]/60">Ưu đãi từ 3 mâm / 20 hộp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Call to Action & Consultation */}
        <div className="lg:w-80 shrink-0 bg-[#E5E1D8]/60 p-4 sm:p-5 rounded-xl border border-black/10 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#C05A3D] mb-1">
              <span>📞 ĐẶT XÔI NHANH TRỰC TIẾP</span>
            </div>
            <p className="text-xs font-sans text-[#1A1A1A]/70 leading-relaxed">
              {language === 'en'
                ? 'Contact Ms. Bình for customized platter sizing, celebration molds and event delivery schedule.'
                : 'Liên hệ Ms. Bình để đặt khuôn mâm, mẫu chữ Hỷ / Tài Lộc và hẹn giờ giao xôi nóng.'}
            </p>
          </div>

          <div className="space-y-2">
            <a
              href={`tel:${cleanPhone}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#C05A3D] hover:bg-[#A0452C] text-white text-xs font-sans font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>{shopInfo.phone} ({shopInfo.contactPerson})</span>
            </a>

            <a
              href={`https://zalo.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2D463E] hover:bg-[#1f332d] text-white text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#E5E1D8]" />
              <span>{t.bulkOrderZaloBtn}</span>
            </a>

            {isAdmin && onAddNewDish && (
              <button
                type="button"
                onClick={onAddNewDish}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1A1A1A] hover:bg-black text-white text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer border border-black/10"
              >
                <PlusCircle className="w-4 h-4 text-[#C05A3D]" />
                <span>{t.addStickyRiceDishBtn}</span>
              </button>
            )}

            {onExploreDishes && (
              <button
                type="button"
                onClick={onExploreDishes}
                className="w-full text-center text-[11px] font-sans font-bold text-[#C05A3D] hover:underline pt-1 cursor-pointer"
              >
                {language === 'en' ? '↓ View All Sticky Rice Platters Below' : '↓ Xem Danh Sách Mâm Xôi & Hộp Tiệc Bên Dưới'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
