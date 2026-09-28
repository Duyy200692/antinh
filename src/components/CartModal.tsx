import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Send,
  Copy,
  Check,
  MessageCircle,
  Phone,
  MapPin,
  User,
  FileText,
  ExternalLink,
  HelpCircle,
  Smartphone,
} from 'lucide-react';
import { CartItem, ShopInfo, Language } from '../types';
import { SHOP_INFO as DEFAULT_SHOP_INFO } from '../data/mockDishes';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onUpdateNote: (id: string, note: string) => void;
  onRemoveItem: (id: string) => void;
  shopInfo?: ShopInfo;
  language?: Language;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onUpdateNote,
  onRemoveItem,
  shopInfo = DEFAULT_SHOP_INFO,
  language = 'vi',
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [generalNote, setGeneralNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [zaloSentNotice, setZaloSentNotice] = useState(false);
  const [showZaloGuide, setShowZaloGuide] = useState(false);

  if (!isOpen) return null;

  // Helper to parse price string to number for total calculation
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const clean = priceStr.replace(/[^0-9]/g, '');
    return parseInt(clean, 10) || 0;
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const unitPrice = parsePrice(item.price);
    return sum + unitPrice * item.quantity;
  }, 0);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Generate formatted Bill Text for Zalo & Copy
  const generateBillText = () => {
    const dateStr = new Date().toLocaleString('vi-VN');
    let text = `📜 *HÓA ĐƠN ĐẶT MÓN - ${shopInfo.name.toUpperCase()}*\n`;
    text += `⏱ Thời gian: ${dateStr}\n`;
    text += `------------------------------------\n`;
    if (customerName || customerPhone || customerAddress) {
      text += `👤 Khách hàng: ${customerName || '(Khách lẻ)'}\n`;
      if (customerPhone) text += `📞 Điện thoại: ${customerPhone}\n`;
      if (customerAddress) text += `📍 Địa chỉ giao: ${customerAddress}\n`;
      text += `------------------------------------\n`;
    }
    text += `📋 *CHI TIẾT ĐƠN HÀNG (${totalQuantity} phần):*\n`;
    cartItems.forEach((item, idx) => {
      const itemTotal = parsePrice(item.price) * item.quantity;
      text += `${idx + 1}. *${item.name}* x${item.quantity} ${item.unit} — ${item.price}`;
      if (itemTotal > 0) {
        text += ` (Thành tiền: ${itemTotal.toLocaleString('vi-VN')}đ)`;
      }
      text += `\n`;
      if (item.note) {
        text += `   💬 Ghi chú: _${item.note}_\n`;
      }
    });
    text += `------------------------------------\n`;
    if (totalAmount > 0) {
      text += `💰 *TỔNG TIỀN TẠM TÍNH: ${totalAmount.toLocaleString('vi-VN')}đ*\n`;
    }
    if (generalNote) {
      text += `📝 Ghi chú chung: ${generalNote}\n`;
    }
    text += `------------------------------------\n`;
    text += ` 🙏 Cảm ơn quý khách đã đặt món tại ${shopInfo.name}!`;
    return text;
  };

  const getZaloTargetUrl = () => {
    const targetZalo = (shopInfo.zaloPhone || shopInfo.phone || '').trim();
    if (targetZalo.startsWith('http://') || targetZalo.startsWith('https://')) {
      return targetZalo;
    }
    const cleanPhone = targetZalo.replace(/[^0-9]/g, '');
    return cleanPhone ? `https://zalo.me/${cleanPhone}` : '';
  };

  const handleSendZalo = async () => {
    const billText = generateBillText();
    // 1. Luôn tự động sao chép nội dung Bill vào bộ nhớ tạm trước để dự phòng
    try {
      await navigator.clipboard.writeText(billText);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      // ignore
    }

    // 2. Ưu tiên tính năng Chia Sẻ Hệ Thống (Web Share API) trên điện thoại:
    // Khách chọn Zalo là Zalo tự động điền 100% Bill vào tin nhắn, không cần Paste!
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Hóa đơn đặt món - ${shopInfo.name}`,
          text: billText,
        });
        return;
      } catch (err: any) {
        // Nếu người dùng hủy hoặc trình duyệt không hỗ trợ, mở hộp thoại hướng dẫn
        if (err.name !== 'AbortError') {
          setShowZaloGuide(true);
        }
        return;
      }
    }

    // 3. Nếu thiết bị không có Web Share (VD: trên máy tính để bàn), mở hộp thoại hướng dẫn 2 bước
    setShowZaloGuide(true);
  };

  const handleOpenZaloNow = () => {
    const billText = generateBillText();
    navigator.clipboard.writeText(billText).then(() => {
      setCopied(true);
    });
    const url = getZaloTargetUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleCallShop = () => {
    const cleanPhone = (shopInfo.phone || shopInfo.zaloPhone || '').replace(/[^0-9]/g, '');
    if (cleanPhone) {
      window.location.href = `tel:${cleanPhone}`;
    }
  };

  const handleSendSMS = () => {
    const billText = generateBillText();
    const cleanPhone = (shopInfo.phone || shopInfo.zaloPhone || '').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(billText);
    window.location.href = `sms:${cleanPhone}?body=${encoded}`;
  };

  const handleCopyBill = () => {
    const billText = generateBillText();
    navigator.clipboard.writeText(billText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-2xl bg-[#FDFCFB] rounded-xl shadow-2xl overflow-hidden border border-black/10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#F4F1EA] px-6 py-4 border-b border-black/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2D463E] text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5 text-[#C05A3D]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl uppercase tracking-tight text-[#1A1A1A]">
                Giỏ Hàng & Hóa Đơn Đặt Món
              </h2>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C05A3D] font-bold">
                {totalQuantity} món đã chọn • {shopInfo.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#E5E1D8] hover:bg-[#D9D1C2] flex items-center justify-center text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-[#F4F1EA] rounded-full flex items-center justify-center mx-auto text-[#C05A3D]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif font-bold text-base text-[#1A1A1A]">Giỏ hàng của bạn đang trống</p>
              <p className="text-xs text-[#1A1A1A]/60 max-w-xs mx-auto">
                Hãy khám phá thực đơn món chay, xôi dẻo, bánh mì và chọn món yêu thích để thêm vào giỏ nhé!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-lg bg-[#2D463E] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#1f332d] transition-colors cursor-pointer"
              >
                Xem Thực Đơn Ngay
              </button>
            </div>
          ) : (
            <>
              {/* Customer Info Form */}
              <div className="bg-[#F4F1EA] p-4 rounded-xl border border-black/10 space-y-3">
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-[#2D463E] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Thông tin người nhận (để xuất Bill & giao hàng)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Tên của bạn / Người nhận *"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-black/15 text-xs focus:ring-1 focus:ring-[#C05A3D]"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Số điện thoại liên hệ *"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-black/15 text-xs focus:ring-1 focus:ring-[#C05A3D]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Địa chỉ giao hàng (Số nhà, đường, phường/xã...)"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-black/15 text-xs focus:ring-1 focus:ring-[#C05A3D]"
                  />
                </div>
              </div>

              {/* Items List (Bill Style) */}
              <div className="space-y-3">
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center justify-between">
                  <span>Danh sách món trong Bill ({cartItems.length})</span>
                  <span className="text-[#C05A3D]">{totalQuantity} phần tổng cộng</span>
                </h3>

                <div className="divide-y divide-black/10 border border-black/10 rounded-xl bg-white overflow-hidden">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-50/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-black/15 shrink-0 shadow-xs"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">{item.name}</h4>
                          <p className="text-xs font-serif font-bold text-[#C05A3D] mt-0.5">
                            {item.price} <span className="font-sans text-[10px] text-gray-500 font-normal">/ {item.unit}</span>
                          </p>

                          {/* Item Note input */}
                          <div className="mt-1.5">
                            <input
                              type="text"
                              value={item.note || ''}
                              onChange={(e) => onUpdateNote(item.id, e.target.value)}
                              placeholder="Ghi chú riêng món này (vd: ít ngọt, không hành...)"
                              className="w-full sm:w-72 px-2 py-1 rounded bg-[#F4F1EA] border border-black/10 text-[11px] text-[#1A1A1A] focus:ring-1 focus:ring-[#C05A3D]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 bg-[#F4F1EA] p-1 rounded-lg border border-black/10">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded bg-white hover:bg-gray-200 text-black flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-[#1A1A1A]">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded bg-[#C05A3D] text-white hover:bg-[#a0452c] flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa món này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Note */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Ghi chú chung cho đơn hàng / Tiệc cúng:
                </label>
                <input
                  type="text"
                  value={generalNote}
                  onChange={(e) => setGeneralNote(e.target.value)}
                  placeholder="Ví dụ: Giao trước 9h sáng, có kèm đũa muỗng..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-black/15 text-xs focus:ring-1 focus:ring-[#C05A3D]"
                />
              </div>

              {/* Bill Summary Box */}
              <div className="bg-[#F4F1EA] p-4 rounded-xl border border-black/10 space-y-2 text-xs">
                <div className="flex justify-between font-sans">
                  <span className="text-[#1A1A1A]/70">Tổng số lượng món:</span>
                  <span className="font-bold text-[#1A1A1A]">{totalQuantity} phần</span>
                </div>
                <div className="flex justify-between font-sans text-sm pt-2 border-t border-black/10">
                  <span className="font-serif font-bold uppercase text-[#1A1A1A]">Tổng tiền tạm tính:</span>
                  <span className="font-serif font-bold text-[#C05A3D] text-base">
                    {totalAmount > 0 ? `${totalAmount.toLocaleString('vi-VN')}đ` : 'Liên hệ xác nhận'}
                  </span>
                </div>
              </div>

              {/* Zalo Sent Notification Toast */}
              {zaloSentNotice && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      📋 <strong>Đã sao chép Hóa đơn!</strong> Đang mở Zalo, quý khách chỉ cần bấm <strong>Dán (Paste)</strong> vào khung chat và nhấn gửi.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setZaloSentNotice(false)}
                    className="text-blue-500 hover:text-blue-800 text-xs font-bold px-2 py-1"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F4F1EA] border-t border-black/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-[#1A1A1A] text-xs font-sans font-bold uppercase tracking-wider border border-black/15 transition-colors cursor-pointer"
          >
            Tiếp Tục Chọn Món
          </button>

          {cartItems.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyBill}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-gray-100 text-[#1A1A1A] text-xs font-sans font-bold uppercase tracking-wider border border-black/15 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Đã sao chép Bill!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#C05A3D]" />
                    <span>Sao chép Bill</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSendZalo}
                className="px-5 py-2 rounded-lg bg-[#0068FF] hover:bg-[#0052cc] text-white text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#0068FF]" />
                <span>Gửi Bill qua Zalo chủ quán</span>
              </button>
            </div>
          )}
        </div>

        {/* Zalo 2-Step Guide Dialog Overlay */}
        {showZaloGuide && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-[#FDFCFB] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-black/10 space-y-4 animate-in zoom-in-95 duration-150 text-[#1A1A1A]">
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-xs">
                    <MessageCircle className="w-5 h-5 fill-white text-[#0068FF]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Hướng Dẫn Gửi Đơn Qua Zalo</h3>
                    <p className="text-[11px] font-sans text-[#1A1A1A]/70">2 thao tác đơn giản để gửi Hóa Đơn</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowZaloGuide(false)}
                  className="w-8 h-8 rounded-full bg-[#F4F1EA] hover:bg-[#E5E1D8] flex items-center justify-center text-[#1A1A1A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Alert */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-sans">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Đã tự động sao chép Hóa đơn vào máy của bạn!</p>
                  <p className="text-[11px] text-emerald-800">Toàn bộ món ăn, số lượng và tổng tiền đã sẵn sàng trong bộ nhớ tạm.</p>
                </div>
              </div>

              {/* Steps Guide */}
              <div className="space-y-3 font-sans text-xs">
                <div className="flex items-start gap-3 p-3 bg-[#F4F1EA] rounded-xl border border-black/5">
                  <span className="w-6 h-6 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                  <div>
                    <p className="font-bold text-[#1A1A1A]">Bấm nút "Mở Ứng Dụng Zalo" bên dưới</p>
                    <p className="text-[11px] text-[#1A1A1A]/70 mt-0.5">Hệ thống sẽ mở ứng dụng Zalo và chuyển thẳng đến cuộc trò chuyện với chủ quán.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-amber-50/70 rounded-xl border border-amber-200/70">
                  <span className="w-6 h-6 rounded-full bg-[#C05A3D] text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                  <div>
                    <p className="font-bold text-[#1A1A1A]">Tại khung chat Zalo: DÁN (PASTE) & GỬI</p>
                    <p className="text-[11px] text-[#1A1A1A]/80 mt-0.5 leading-relaxed">
                      👉 <strong>Chạm giữ ngón tay vào ô gõ tin nhắn</strong> ➔ Chọn chữ <strong>"Dán" (Paste)</strong> ➔ Bấm nút <strong>Gửi</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleOpenZaloNow}
                  className="w-full py-3 px-4 rounded-xl bg-[#0068FF] hover:bg-[#0052cc] text-white font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Mở Ứng Dụng Zalo Ngay (Bước 1)</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCallShop}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#2D463E] hover:bg-[#233731] text-white font-sans font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E5A93B]" />
                    <span>Gọi Hotline Quán</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendSMS}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-[#1A1A1A] font-sans font-bold text-xs border border-black/15 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Gửi tin nhắn SMS sẽ tự động điền sẵn toàn bộ chữ vào tin nhắn"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#2D463E]" />
                    <span>Gửi SMS (Tự điền)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyBill}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-[#1A1A1A] font-sans font-bold text-xs border border-black/15 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#C05A3D]" />
                    <span>{copied ? 'Đã chép!' : 'Chép lại'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
