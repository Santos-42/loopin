import React from 'react';
import { Achievement, MOCK_ACHIEVEMENT_LIST } from '../types';
import { Trophy, Award, Flame, Calendar, Sparkles, CheckCircle, Zap } from 'lucide-react';

interface RewardsProps {
  streak: number;
  achievements: Achievement[];
}

export default function Rewards({ streak, achievements }: RewardsProps) {
  // Compute some progress metrics
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const currentXP = 240 + streak;
  const targetXP = 500;
  const levelProgress = Math.round((currentXP / targetXP) * 100);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#0a0a0a] text-slate-100 p-5 z-10 space-y-6">
      
      {/* Decorative Glow */}
      <div className="absolute top-1/4 right-5 w-24 h-24 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Stats Header Area */}
      <div className="space-y-1 my-1">
        <span className="text-[8.5px] uppercase font-mono tracking-wider text-white/40 font-semibold block">Metrik Sosial & Level Gamifikasi</span>
        <h2 className="text-xl font-normal font-serif leading-tight flex items-center gap-1.5 text-white">
          Reputasi & Prestasi <Trophy className="w-5 h-5 text-[#C5A059]" />
        </h2>
        <p className="text-[10px] text-white/50 leading-relaxed font-sans">
          Aktivitas andalan, kehadiran yang tepat waktu, dan lencana teman mabar meningkatkan reputasi tepercaya Anda di Jakarta.
        </p>
      </div>

      {/* Large Level Card */}
      <div className="bg-[#1a1a1a] p-5 rounded-3xl border border-white/5 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none">
        
        {/* Streak Indicator top-right */}
        <div className="absolute top-4 right-4 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl px-2.5 py-1 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#C5A059] fill-[#C5A059] animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-[#C5A059]">{streak} Hari Streak</span>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[8px] uppercase tracking-wider font-mono text-white/40 font-semibold block">Gelar Reputasi</span>
            <h3 className="text-lg font-normal font-serif text-white mt-1">Vibe Booster Level 3</h3>
            <p className="text-[9.5px] text-white/50 mt-0.5 font-sans">Kehadiran andalan Anda di atas 98% kelompok lobi hobi.</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-white/40">Ke Level 4</span>
              <span className="text-[#C5A059] font-semibold">{currentXP} / {targetXP} XP ({levelProgress}%)</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-[#0a0a0a] border border-white/5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#C5A059] to-[#d8b473] h-full rounded-full transition-all duration-500" 
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Mini benefits panel */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-[#0a0a0a] p-2.5 border border-white/5 rounded-xl flex items-center gap-1.5 text-white/70">
              <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Prioritas Lobi Match</span>
            </div>
            <div className="bg-[#0a0a0a] p-2.5 border border-white/5 rounded-xl flex items-center gap-1.5 text-white/70">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>+3 Badges Andalan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges overview */}
      <div className="space-y-3.5">
        <div className="flex justify-between items-center bg-transparent">
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-white/50">Lencana Prestasi ({unlockedCount}/{achievements.length})</span>
          <span className="text-[9.5px] text-[#C5A059] font-medium font-mono select-none">Buka Lencana Hub</span>
        </div>

        <div className="space-y-2.5">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              className={`p-3 rounded-2xl border transition duration-200 flex items-center gap-3.5 select-none ${
                ach.unlocked 
                  ? 'bg-[#1a1a1a] border-white/5 text-slate-100 shadow-sm'
                  : 'bg-[#1a1a1a]/40 border-white/5 text-white/30 opacity-50'
              }`}
            >
              {/* Achievement Badge Circle */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                ach.unlocked 
                  ? 'bg-[#0a0a0a] border border-[#C5A059]/20' 
                  : 'bg-[#0a0a0a] border border-white/5 text-slate-500'
              }`}>
                {ach.icon}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-medium font-serif leading-none truncate text-white">{ach.title}</h4>
                  {ach.unlocked ? (
                    <span className="text-[8px] bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/15 rounded px-1.5 py-0.5 font-mono font-semibold">
                      {ach.badgeName}
                    </span>
                  ) : (
                    <span className="text-[8px] text-white/40 font-mono">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  )}
                </div>
                <p className="text-[9.5px] text-white/50 mt-1.5 leading-relaxed font-sans">
                  {ach.description}
                </p>

                {/* Progress bar inside pending achievements */}
                {!ach.unlocked && (
                  <div className="w-full h-1 bg-[#0a0a0a] rounded-full overflow-hidden mt-2">
                    <div 
                      className="bg-[#C5A059]/20 h-full rounded-full" 
                      style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
