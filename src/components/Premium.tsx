import React, { useState } from 'react';
import { Sparkles, Check, Crown, CreditCard, ShieldCheck } from 'lucide-react';

interface PremiumProps {
  isPremium: boolean;
  onUpgradeSuccess: () => void;
}

export default function Premium({ isPremium, onUpgradeSuccess }: PremiumProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      onUpgradeSuccess();
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#0a0a0a] text-slate-100 p-5 z-10 flex flex-col justify-between">
      
      {/* Background ambient light effects */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="space-y-4">
        {/* Header Title with Crown */}
        <div className="text-center space-y-1.5 pt-4">
          <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center text-[#0a0a0a] mx-auto shadow-[0_4px_16px_rgba(197,160,89,0.3)] select-none">
            <Crown className="w-6 h-6 fill-[#0a0a0a]" />
          </div>
          <h2 className="text-xl font-normal font-serif text-[#C5A059] tracking-tight mt-3">
            Loopin Premium Plus
          </h2>
          <p className="text-[10px] text-white/50 max-w-xs mx-auto leading-relaxed">
            Singkirkan batas pencarian dan nikmati pencarian hobi andalan tanpa batas (unlimited match) di seluruh Indonesia.
          </p>
        </div>

        {/* Current status info */}
        {isPremium || success ? (
          <div className="bg-[#1a1a1a] border border-[#C5A059]/30 p-5 rounded-3xl text-center space-y-3.5 shadow-lg select-none">
            <span className="text-xl">🌟👑🎉</span>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold font-serif text-[#C5A059]">AKUN ANDA AKTIF PREMIUM!</h4>
              <p className="text-[10px] text-white/50 leading-relaxed">Selamat! Kuota harian Anda kini tak terbatas dan mendapatkan prioritas rekomendasi terbaik.</p>
            </div>
            <div className="text-[10px] bg-[#0a0a0a] p-2.5 border border-white/5 text-white/80 rounded-xl inline-block font-mono font-bold tracking-wide">
              ID ANGGOTA: PREMIUM-95231
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Plan Card Pricing */}
            <div className="bg-[#1a1a1a] p-5 rounded-3xl border border-[#C5A059]/20 shadow-xl relative overflow-hidden select-none">
              <div className="absolute top-0 right-0 bg-[#C5A059] text-[#0a0a0a] text-[8px] font-bold uppercase px-3 py-1.5 rounded-bl-xl font-mono">
                Pilihan Terbaik
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-mono text-white/40 block font-semibold">Akses Penuh Selamanya</span>
                  <div className="flex items-baseline gap-1 mt-1 font-mono">
                    <span className="text-2xl font-normal font-serif text-white">Rp 49.000</span>
                    <span className="text-[9px] text-white/40">/ sekali bayar</span>
                  </div>
                </div>

                {/* Checklist Benefits */}
                <div className="space-y-2 border-t border-white/5 pt-3.5 text-xs">
                  {[
                    'Smart Matchmaking Tanpa Batas Kuota',
                    'Akses Ruang Lobi Spontan Premium',
                    'Cari Rekomendasi Alamat Terlengkap',
                    'Dapatkan Lencana Premium Eksklusif',
                    'Tanpa Iklan & Bebas Layar Menggantung'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-white/80">
                      <span className="bg-[#C5A059]/10 border border-[#C5A059]/25 text-[#C5A059] rounded-full p-0.5 shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="font-sans text-[11px]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Safety guarantee */}
            <div className="bg-[#1a1a1a]/40 p-3 border border-white/5 rounded-2xl text-[9px] text-white/40 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Metode pembayaran dijamin 100% aman dan langsung membuka kunci fitur (instant unlocking).</span>
            </div>
          </div>
        )}
      </div>

      {/* Action CTA Button */}
      {!isPremium && !success && (
        <div className="pb-4 pt-4 border-t border-white/5 shrink-0 bg-transparent">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full font-bold text-xs py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 ${
              isProcessing
                ? 'bg-[#1a1a1a] text-white/20 cursor-not-allowed border border-white/5'
                : 'bg-[#C5A059] hover:bg-[#d8b473] text-[#0a0a0a] shadow-[0_4px_16px_rgba(197,160,89,0.25)] active:scale-95 cursor-pointer font-sans'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 animate-spin text-[#0a0a0a]" />
                Mengamankan Transaksi Anda...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Bayar Rp 49.000 Sekarang
              </span>
            )}
          </button>
        </div>
      )}

    </div>
  );
}
