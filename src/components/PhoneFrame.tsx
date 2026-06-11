import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Info } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const [timeState, setTimeState] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeState(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[100dvh] w-screen bg-[#0a0a0a] flex flex-col md:flex-row items-center justify-center p-0 md:py-4 md:px-8 font-sans overflow-hidden relative select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/2 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand information side panel for desktop */}
      <div className="hidden md:flex text-white md:mr-12 max-w-sm md:max-w-md text-center md:text-left z-10 flex-col items-center md:items-start p-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
          Loopin - Hobby Matchmaker
        </div>
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight font-serif text-white">
          Loopin App
        </h1>
        <p className="text-sm md:text-base text-white/60 mt-3 font-normal leading-relaxed">
          Platform digital berbasis AI yang mempertemukan kamu dalam <strong className="text-[#C5A059] font-medium font-serif italic">micro-group activity (2-5 orang)</strong> berdasarkan kesamaan hobi, tingkat skill, dan vibe.
        </p>
        
        {/* Features Checklist */}
        <div className="mt-6 space-y-3.5 text-xs text-white/40 w-full text-left bg-[#1a1a1a]/50 p-5 border border-white/5 rounded-2xl backdrop-blur-lg">
          <div className="flex items-start gap-2.5">
            <span className="text-[#C5A059]">01</span>
            <span><strong>Smart Swiping Matchmaking</strong>: Cari teman yang sehobi dengan kecocokan skill, vibe, & jadwal</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-[#C5A059]">02</span>
            <span><strong>AI Safety Filter</strong>: Pendeteksian kata kasar & sensor chat lobi secara-real time demi rasa aman</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-[#C5A059]">03</span>
            <span><strong>Location & Time Engine</strong>: Rekomendasi jadwal tumpang-tindih (overlap) & titik tengah (midpoint) otomatis</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-[#C5A059]">04</span>
            <span><strong>Gamification</strong>: Reputasi, badges ksatria handal, streak, dan upgrade premium paywall</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-white/30 bg-[#121212]/30 px-3 py-2 rounded-xl border border-white/5">
          <Info className="w-4 h-4 text-[#C5A059]" />
          <span>Gunakan interaksi dalam bingkai telepon genggam di sebelah kanan.</span>
        </div>
      </div>

      {/* Beautiful Simulated Smartphone Wrapper (Phone frame) */}
      <div className="relative z-10 w-full h-full md:w-auto md:h-auto phone-scale-wrapper">
        
        {/* Exterior shadow & glow container */}
        <div className="relative mx-auto w-full h-full md:w-auto md:h-auto bg-transparent md:bg-[#1a1a1a] rounded-none md:rounded-[60px] p-0 md:p-[13px] border-0 md:border-[5px] border-[#262626] shadow-none md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-0 md:ring-1 ring-white/5">
          
          {/* Edge physical volume keys and power button on simulated shell */}
          <div className="hidden md:block absolute left-[-16px] top-[140px] w-[6px] h-[55px] bg-[#222] rounded-l-md border-r border-[#111] shadow-lg"></div>
          <div className="hidden md:block absolute left-[-16px] top-[205px] w-[6px] h-[55px] bg-[#222] rounded-l-md border-r border-[#111] shadow-lg"></div>
          <div className="hidden md:block absolute right-[-16px] top-[170px] w-[6px] h-[75px] bg-[#222] rounded-r-md border-l border-[#111] shadow-lg"></div>

          {/* Active Screen Frame */}
          <div className="relative w-full h-full md:w-[375px] md:h-[780px] bg-[#0a0a0a] rounded-none md:rounded-[48px] overflow-hidden flex flex-col select-none ring-0 md:ring-4 ring-[#262626] border-0 md:border border-white/5">
            
            {/* Status Bar Container */}
            <div className="hidden md:flex h-11 w-full bg-[#0a0a0a]/90 text-white items-center justify-between px-7 pt-1 z-30 select-none">
              <span className="text-xs font-semibold tracking-tight text-white/50">{timeState || '11:23'}</span>
              
              {/* Dynamic Island / Notch Camera */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-2 h-5.5 w-26 bg-black rounded-full items-center justify-center gap-1.5 z-40 transition-all shadow-inner border border-white/5">
                <span className="w-1.5 h-1.5 bg-[#C5A059]/20 rounded-full"></span>
                <span className="w-2.5 h-1 bg-neutral-900 rounded-full"></span>
                <div className="w-1.5 h-1.5 bg-[#C5A059]/20 rounded-full absolute right-3 flex items-center justify-center">
                  <span className="w-1 h-1 bg-[#C5A059] rounded-full animate-pulse"></span>
                </div>
              </div>

              {/* Status Bar Icons */}
              <div className="flex items-center gap-1.5 text-white/50">
                <Signal className="w-3.5 h-3.5 fill-white/50" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 text-white/50 fill-white/40" />
              </div>
            </div>

            {/* Simulated Phone Content Panel */}
            <div className="flex-1 w-full relative overflow-hidden flex flex-col bg-[#0a0a0a]">
              {children}
            </div>

            {/* Bottom Swipe Home Indicator */}
            <div className="hidden md:flex h-6 w-full bg-[#0a0a0a]/90 items-center justify-center z-30 relative shrink-0">
              <div className="w-32 h-1 bg-white/10 rounded-full hidden md:block"></div>
            </div>

            {/* Phone Screen Glossy shine overlap */}
            <div className="absolute inset-0 pointer-events-none phone-glass-reflection z-40 rounded-none md:rounded-[48px] hidden md:block"></div>

          </div>
        </div>
      </div>
    </div>
  );
}
