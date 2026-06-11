import React, { useState, useEffect } from 'react';
import { UserProfile, MOCK_USERS, HOBBY_LIST } from '../types';
import { Heart, X, Sparkles, Check, MapPin, Award, CheckCircle, RefreshCw, Calendar, Flame, Users, Zap } from 'lucide-react';

interface MatchDiscoveryProps {
  userProfile: any;
  onJoinLobby: (hobbyName: string, partner: UserProfile, compatibilityScore: number) => void;
  onNavigateToPremium: () => void;
}

export default function MatchDiscovery({ userProfile, onJoinLobby, onNavigateToPremium }: MatchDiscoveryProps) {
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchOverlay, setShowMatchOverlay] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [currentScore, setCurrentScore] = useState(85);

  // Filter and compute compatibility at startup
  useEffect(() => {
    // Exclude self
    const list = MOCK_USERS.filter(u => u.name !== userProfile.name);
    
    // Sort list by highest compatibility score first!
    const sortedList = [...list].sort((a, b) => {
      return calculateScore(b) - calculateScore(a);
    });

    setCandidates(sortedList);
    setCurrentIndex(0);
  }, [userProfile]);

  // Mathematical scoring calculation matching the spec!
  const calculateScore = (candidate: UserProfile): number => {
    let score = 30; // Base score
    
    // 1. Hobby match (up to 40%)
    const commonHobbies = candidate.hobbies.filter(h => userProfile.hobbies.includes(h));
    if (commonHobbies.length > 0) {
      score += 40;
    } else {
      score += 15;
    }

    // 2. Skill level suitability (up to 15%)
    if (candidate.skillLevel === userProfile.skillLevel) {
      score += 15;
    } else if (
      (candidate.skillLevel === 'Intermediate' && userProfile.skillLevel === 'Beginner') ||
      (candidate.skillLevel === 'Intermediate' && userProfile.skillLevel === 'Pro')
    ) {
      score += 10;
    }

    // 3. Vibe style preference match (up to 15%)
    if (candidate.vibe === userProfile.vibe) {
      score += 15;
    } else {
      score += 5;
    }

    // 4. Overlapping schedules in weekly slot (up to 20%)
    let dayOverlap = false;
    let slotOverlap = false;

    Object.keys(userProfile.availability).forEach(day => {
      if (candidate.availability[day]) {
        dayOverlap = true;
        const intersection = userProfile.availability[day].filter((s: string) => 
          candidate.availability[day].includes(s)
        );
        if (intersection.length > 0) {
          slotOverlap = true;
        }
      }
    });

    if (slotOverlap) score += 20;
    else if (dayOverlap) score += 10;

    return Math.min(score, 99);
  };

  const handleSwipeLeft = () => {
    if (currentIndex < candidates.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex < candidates.length) {
      const candidate = candidates[currentIndex];
      const score = calculateScore(candidate);
      
      setMatchedUser(candidate);
      setCurrentScore(score);
      setShowMatchOverlay(true);
    }
  };

  const currentCandidate = candidates[currentIndex];
  const compatibilityScore = currentCandidate ? calculateScore(currentCandidate) : 85;

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0a0a0a] text-slate-100 z-10 relative overflow-y-auto overflow-x-hidden no-scrollbar">
      
      {/* Header indicators */}
      <div className="px-5 pt-3.5 pb-2 border-b border-white/5 bg-[#0a0a0a]/90 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-lg text-[#C5A059]">🤝</span>
          <h2 className="text-sm font-normal font-serif text-white tracking-tight">Match Hobi</h2>
        </div>
        <div className="bg-[#C5A059]/10 border border-[#C5A059]/25 rounded-full px-2.5 py-1 text-[9px] font-semibold text-[#C5A059] flex items-center gap-1 font-mono">
          <Sparkles className="w-3 h-3 text-[#C5A059] animate-pulse" />
          <span>Loopin AI Rujukan</span>
        </div>
      </div>

      {/* Main card viewport */}
      <div className="flex-1 p-4 flex items-center justify-center relative">
        {currentCandidate ? (
          <div className="w-full max-w-[340px] h-[510px] bg-[#1a1a1a] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.7)] group">
            
            {/* Compatibility Badge pill at top left */}
            <div className="absolute top-4 left-4 z-20 bg-[#0a0a0a]/90 border border-[#C5A059]/30 rounded-full px-3 py-1 text-[10px] shadow-lg backdrop-blur-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
              <span className="font-semibold text-white tracking-wide font-mono">{compatibilityScore}% Cocok</span>
            </div>

            {/* Profile Avatar background decoration element */}
            <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#C5A059]/10 via-transparent to-transparent pointer-events-none"></div>

            {/* Content inside candidate card */}
            <div className="px-4.5 pt-12 pb-3.5 flex-1 flex flex-col justify-between overflow-hidden">
              
              {/* Giant avatar & basic badge */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#0a0a0a] border border-[#C5A059]/30 flex items-center justify-center text-4xl relative shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                  {currentCandidate.avatar}
                  {currentCandidate.isVerified && (
                    <span className="absolute -bottom-0.5 -right-0.5 bg-[#C5A059] border border-[#0a0a0a] rounded-full p-0.5" title="Verifikasi Foto">
                      <CheckCircle className="w-3.5 h-3.5 text-[#0a0a0a] stroke-[3]" />
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-normal font-serif mt-2.5 text-white flex items-center gap-1.5">
                  {currentCandidate.name}, <span className="text-white/65 font-light text-lg">{currentCandidate.age}</span>
                </h3>
                <p className="text-white/40 text-[10px] mt-0.5 flex items-center gap-1 tracking-wide font-mono">
                  <MapPin className="w-3 h-3 text-[#C5A059]" /> {currentCandidate.location}
                </p>
                <span className="text-[9px] mt-1 bg-[#0a0a0a] text-[#C5A059] border border-[#C5A059]/20 px-2 py-0.5 rounded-full font-mono font-semibold">
                  🎖️ {currentCandidate.reputationBadge}
                </span>
              </div>

              {/* BIO */}
              <div className="my-2.5 bg-[#0a0a0a]/50 p-2.5 rounded-2xl border border-white/5">
                <p className="text-[11px] text-white/70 italic leading-relaxed text-center font-serif">
                  "{currentCandidate.bio}"
                </p>
              </div>

              {/* Match Factors and Interests */}
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-wider text-white/40 font-mono font-semibold block">Serasi Dalam Vibe & Hobi</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentCandidate.hobbies.map(h => {
                      const isShared = userProfile.hobbies.includes(h);
                      return (
                        <span
                          key={h}
                          className={`text-[9px] font-medium px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                            isShared
                              ? 'bg-[#C5A059]/10 border-[#C5A059]/35 text-[#C5A059]'
                              : 'bg-[#0a0a0a] border-white/5 text-white/40'
                          }`}
                        >
                          <span>{HOBBY_LIST.find(item => item.name === h)?.icon || '⭐'}</span>
                          <span>{h}</span>
                          {isShared && <span className="text-[8px] opacity-60 font-mono font-extrabold pb-0.5">✔</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-[#0a0a0a]/50 p-2 border border-white/5 rounded-xl">
                    <span className="text-white/40 block text-[8px] uppercase font-mono font-semibold">Aura Vibe</span>
                    <span className="font-semibold text-white/80">{currentCandidate.vibe === 'Relaxed' ? 'Santai🍃' : currentCandidate.vibe === 'Competitive' ? 'Kompetitif🏆' : 'Sosialis💬'}</span>
                  </div>
                  <div className="bg-[#0a0a0a]/50 p-2 border border-white/5 rounded-xl">
                    <span className="text-white/40 block text-[8px] uppercase font-mono font-semibold">Kemahiran</span>
                    <span className={`font-semibold ${currentCandidate.skillLevel === userProfile.skillLevel ? 'text-[#C5A059]' : 'text-white/60'}`}>
                      {currentCandidate.skillLevel} {currentCandidate.skillLevel === userProfile.skillLevel ? '🤝 Setara' : ''}
                    </span>
                  </div>
                </div>

                {/* Overlapping calendar highlights */}
                <div className="bg-[#C5A059]/5 border border-[#C5A059]/15 p-2 rounded-xl flex items-center justify-between text-[9px] text-[#C5A059] mb-1">
                  <span className="flex items-center gap-1 font-mono uppercase tracking-wide text-[8.5px]">
                    <Calendar className="w-3 h-3 shrink-0 text-[#C5A059]" />
                    <span>Jadwal Kompatibilitas</span>
                  </span>
                  <span className="font-semibold font-mono">Overlapping Terdeteksi</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons on card base */}
            <div className="p-3 bg-[#0a0a0a] border-t border-white/5 flex gap-5 items-center justify-center shrink-0">
              <button
                onClick={handleSwipeLeft}
                id="swipe-reject-btn"
                className="w-11 h-11 bg-[#1a1a1a] border border-white/5 hover:border-[#C5A059]/20 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition text-white/40 hover:text-white/60 cursor-pointer"
                title="Lewati"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleSwipeRight}
                id="swipe-like-btn"
                className="w-13 h-13 bg-[#C5A059] hover:bg-[#d8b473] text-[#0a0a0a] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(197,160,89,0.25)] hover:scale-105 active:scale-95 transition cursor-pointer"
                title="Sukai / Match"
              >
                <Heart className="w-5.5 h-5.5 fill-[#0a0a0a] stroke-[#0a0a0a] stroke-[2.5]" />
              </button>
            </div>
          </div>
        ) : (
          /* Finished stack fallback statement */
          <div className="text-center p-6 bg-[#1a1a1a] border border-white/5 rounded-3xl max-w-[290px] mx-auto space-y-4 animate-fade-in relative overflow-hidden">
            <div className="w-14 h-14 bg-[#0a0a0a] border border-[#C5A059]/25 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner relative">
              🛰️
              <div className="absolute inset-0 rounded-full border border-[#C5A059]/10 ripple-animate pointer-events-none"></div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium font-serif text-[#C5A059]">Sedang Mencari Match Baru</h4>
              <p className="text-[10px] text-white/50 leading-relaxed">
                Matchmaker AI terus memantau ketersediaan slot kosong dan preferensi vibe pengguna baru di sekitar Jakarta.
              </p>
            </div>
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-4 py-2 bg-[#0a0a0a] border border-[#C5A059]/15 text-[10px] rounded-xl hover:border-[#C5A059]/35 text-[#C5A059] font-semibold inline-flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Kartu Loopin
            </button>
          </div>
        )}
      </div>

      {/* Suggested Spontaneous lobbies shortcut */}
      <div className="px-4.5 py-3 border-t border-white/5 bg-[#1a1a1a]/30 shrink-0">
        <span className="text-[8.5px] uppercase font-bold tracking-wider text-white/40 flex items-center gap-1 font-mono">
          <Users className="w-3.5 h-3.5 text-[#C5A059]" /> Masuk Instan (Spontaneous Lobby) 
        </span>
        <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar flex-nowrap scroll-smooth">
          {[
            { id: 'lob-1', name: 'Mabar Badminton Jaksel', h: 'Badminton', slots: 3, icon: '🏸', score: 94 },
            { id: 'lob-2', name: 'Boardgames Night Kemang', h: 'Board Games', slots: 4, icon: '🎲', score: 88 }
          ].map((sp) => {
            const partner = MOCK_USERS.find(item => item.hobbies.includes(sp.h)) || MOCK_USERS[0];
            return (
              <button
                key={sp.id}
                onClick={() => onJoinLobby(sp.h, partner, sp.score)}
                className="shrink-0 w-[185px] text-left bg-[#1a1a1a]/50 border border-white/5 p-2.5 rounded-2xl hover:border-[#C5A059]/30 transition flex items-center justify-between select-none cursor-pointer"
              >
                <div className="min-w-0 pr-1">
                  <span className="text-[10.5px] font-medium text-white block truncate leading-none font-serif">{sp.name}</span>
                  <span className="text-[8px] text-[#C5A059] font-mono mt-1 block font-semibold">Tinggal {sp.slots} Slot • Match {sp.score}%</span>
                </div>
                <span className="text-xl shrink-0">{sp.icon}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MATCHED POPUP SYSTEM OVERLAY */}
      {showMatchOverlay && matchedUser && (
        <div className="absolute inset-0 bg-[#0a0a0a]/98 flex flex-col justify-between p-6 z-50 animate-fade-in">
          
          <div className="text-center space-y-1.5 mt-12">
            <div className="inline-flex py-1 px-3 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full text-[9px] text-[#C5A059] font-semibold uppercase tracking-wider items-center gap-1.5 font-mono">
              <Flame className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
              Kecocokan Terbaca AI!
            </div>
            <h2 className="text-2xl font-normal font-serif text-white tracking-tight">
              Kocokan Loop Cocok! 🎉
            </h2>
            <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
              Matchmaker membaca kecocokan tinggi hobi, level bermain, dan tumpang tindih waktu Anda dengan <span className="font-semibold text-[#C5A059]">{matchedUser.name}</span>!
            </p>
          </div>

          {/* Interactive Match Portraits inside Phone frame */}
          <div className="flex items-center justify-center gap-6 my-4 relative">
            <div className="absolute left-1/2 -smart-x-1/2 bg-[#C5A059] text-[#0a0a0a] rounded-full p-2.5 font-mono font-bold border-4 border-[#0a0a0a] text-xs z-10 shadow-lg select-none">
              {currentScore}%
            </div>

            {/* Left Portrait */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#C5A059]/20 flex items-center justify-center text-4xl shadow-md">
                {userProfile.avatar}
              </div>
              <span className="text-[10px] font-semibold mt-1.5 text-white/50 font-mono">Anda</span>
            </div>

            {/* Right Portrait */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#C5A059] flex items-center justify-center text-4xl shadow-md relative">
                {matchedUser.avatar}
                <div className="absolute inset-0 rounded-full border border-[#C5A059]/10 ripple-animate pointer-events-none"></div>
              </div>
              <span className="text-[10px] font-semibold mt-1.5 text-[#C5A059] font-mono">{matchedUser.name.split(' ')[0]}</span>
            </div>
          </div>

          {/* Matched Details Summarised */}
          <div className="bg-[#1a1a1a] border border-white/5 p-4 rounded-2xl max-w-xs mx-auto space-y-2 text-left w-full">
            <span className="text-[8px] text-white/40 uppercase tracking-widest block font-bold font-mono">Karakter Evaluasi</span>
            <div className="space-y-1.5 text-[11px] text-white/80 font-mono">
              <div className="flex justify-between items-center pb-1 border-b border-white/5">
                <span className="text-white/40">Hobi Bersama:</span>
                <span className="font-semibold text-[#C5A059]">{userProfile.hobbies.filter((h: string) => matchedUser.hobbies.includes(h))[0] || userProfile.hobbies[0]}</span>
              </div>
              <div className="flex justify-between items-center pb-1 border-b border-white/5">
                <span className="text-white/40">Kemahiran:</span>
                <span className="font-semibold text-white">{userProfile.skillLevel} & {matchedUser.skillLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">Gaya Bermain:</span>
                <span className="font-semibold text-[#C5A059]">{matchedUser.vibe} Style</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pb-8 w-full max-w-xs mx-auto">
            <button
              onClick={() => {
                setShowMatchOverlay(false);
                onJoinLobby(userProfile.hobbies[0] || 'Badminton', matchedUser, currentScore);
              }}
              className="w-full bg-[#C5A059] hover:bg-[#d8b473] text-[#0a0a0a] font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(197,160,89,0.2)] cursor-pointer"
            >
              <span>Mulai Lobi Mikro-Group</span>
              <Sparkles className="w-4 h-4 text-[#0a0a0a]" />
            </button>
            
            <button
              onClick={() => setShowMatchOverlay(false)}
              className="w-full bg-[#1a1a1a] text-white/40 hover:text-white/60 font-semibold text-xs py-2 px-4 rounded-xl cursor-pointer transition"
            >
              Nanti Saja
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
