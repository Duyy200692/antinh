import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
  currentPin?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  currentPin = '1234',
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = pin.trim();
    const targetPin = (currentPin || '1234').trim();

    // Verify against current custom PIN or emergency master fallback
    if (cleanInput === targetPin || cleanInput === 'admin123' || (targetPin === '1234' && cleanInput === '8888')) {
      setErrorMsg('');
      setPin('');
      onSuccessLogin();
    } else {
      setErrorMsg('Mật khẩu PIN không chính xác! Vui lòng thử lại.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FDFCFB] text-[#1A1A1A] rounded-lg shadow-2xl border border-black/10 overflow-hidden">
        {/* Header */}
        <div className="bg-[#2D463E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-white/10 flex items-center justify-center text-[#C05A3D]">
              <ShieldCheck className="w-5 h-5 text-[#E5E1D8]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg uppercase tracking-tight">
                Đăng Nhập Quản Trị Bếp
              </h3>
              <p className="font-sans text-[11px] text-[#E5E1D8]/80">
                Xác thực quyền Admin để chỉnh sửa & thêm món
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="bg-[#F4F1EA] p-3.5 rounded-sm border-l-2 border-[#C05A3D] text-xs font-sans text-[#1A1A1A]/80 leading-relaxed">
            <p className="font-bold text-[#1A1A1A] mb-0.5">🔒 Quyền Truy Cập Nội Bộ Admin</p>
            Khách hàng chỉ được xem thực đơn. Hãy nhập mã PIN quản trị viên để mở khoá các tính năng thêm món, sửa giá và báo hết hàng.
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm text-xs font-sans flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1.5">
              Mã PIN Quản Trị Bếp
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Nhập mã PIN (Mặc định: 1234)"
                autoFocus
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-sm bg-[#F4F1EA] border border-black/15 text-[#1A1A1A] text-sm focus:outline-none focus:ring-1 focus:ring-[#C05A3D] font-mono tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#1A1A1A]/50 font-sans mt-1">
              {currentPin === '1234' ? (
                <>* Mã PIN mặc định cho nhân viên bếp: <strong className="text-[#C05A3D]">1234</strong></>
              ) : (
                <>* Quán đã bật mã PIN bảo mật riêng. Vui lòng nhập đúng mã đã thiết lập.</>
              )}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm bg-[#E5E1D8] hover:bg-[#D9D1C2] text-[#1A1A1A] font-sans text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-sm bg-[#C05A3D] hover:bg-[#a0452c] text-white font-sans text-xs uppercase tracking-wider font-bold shadow-md transition-colors cursor-pointer"
            >
              Đăng Nhập Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
