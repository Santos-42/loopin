import React, { useState } from 'react';
import { HOBBY_LIST, DAYS_OF_WEEK, TIME_SLOTS, SkillLevel, VibePreference } from '../types';
import { ArrowRight, Sparkles, Check, Compass, Calendar, Zap, Smile } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: {
    name: string;
    age: number;
    hobbies: string[];
    skillLevel: SkillLevel;
    vibe: VibePreference;
    availability: { [day: string]: string[] };
    avatar: string;
  }) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState(21);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Intermediate');
  const [vibe, setVibe] = useState<VibePreference>('Social');
  const [avatar, setAvatar] = useState('🧑‍🚀');
  
  // Day -> multiple selected time slot strings
  const [availability, setAvailability] = useState<{ [day: string]: string[] }>({
    'Sabtu': [TIME_SLOTS[2]], // Default some times
    'Minggu': [TIME_SLOTS[0]]
  });

  const avatarsList = ['🧑‍🚀', '👩‍🎨', '🏃‍♂️', '🧙‍♂️', '👾', '🧘‍♀️', '🧗‍♀️', '🍿', '🎧', '🎸'];

  const toggleHobby = (hobbyName: string) => {
    if (selectedHobbies.includes(hobbyName)) {
      setSelectedHobbies(selectedHobbies.filter(item => item !== hobbyName));
    } else {
      setSelectedHobbies([...selectedHobbies, hobbyName]);
    }
  };

  const toggleAvailability = (day: string, slot: string) => {
    const currentSlots = availability[day] || [];
    let updatedSlots;
    if (currentSlots.includes(slot)) {
      updatedSlots = currentSlots.filter(s => s !== slot);
    } else {
      updatedSlots = [...currentSlots, slot];
    }
    setAvailability({
      ...availability,
      [day]: updatedSlots
    });
  };

  const isStepValid = () => {
    if (step === 1) return name.trim().length >= 2 && age >= 17;
    if (step === 2) return selectedHobbies.length >= 1;
    if (step === 3) return true;
    if (step === 4) {
      // Check if there is at least one slot selected across all days
      return Object.values(availability).some(slots => (slots as any).length > 0);
    }
    return true;
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onComplete({
        name,
        age,
        hobbies: selectedHobbies,
        skillLevel,
        vibe,
        availability,
        avatar
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col justify-between bg-[#0a0a0a] text-slate-200 p-6 z-10 relative">
      
      {/* Background radial gradients for onboarding */}
      <div className="absolute top-10 left-5 w-40 h-40 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-5 w-40 h-40 bg-white/2 rounded-full blur-2xl pointer-events-none"></div>

      {/* Steps Header Indicator */}
      <div className="flex items-center justify-between z-10 mb-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C5A059] font-mono">
          Langkah {step} dari 5
        </span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all duration-300 ${
                s <= step ? 'w-5 bg-[#C5A059]' : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Form content frame */}
      <div className="flex-1 overflow-y-auto no-scrollbar z-10 pb-6">
        
        {/* STEP 1: Identification & Profile */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6 mt-4">
            <div className="space-y-1">
              <p className="text-[#C5A059] font-serif italic text-sm">Selamat datang</p>
              <h2 className="text-2xl font-normal font-serif text-white tracking-tight">
                Mulai Petualangan Loopin ✨
              </h2>
              <p className="text-xs text-white/50 leading-relaxed">
                Mari buat karakter profil kamu untuk analisis smart matchmaking AI kami.
              </p>
            </div>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Pilih Avatar-mu</label>
              <div className="text-4xl text-center bg-[#1a1a1a] leading-none py-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3">
                <span className="p-3 bg-[#C5A059]/10 rounded-full border border-[#C5A059]/30 scale-110 select-none text-[#C5A059]">
                  {avatar}
                </span>
                <div className="flex flex-wrap justify-center gap-2 px-4 mt-2">
                  {avatarsList.map((av) => (
                    <button
                      key={av}
                      onClick={() => setAvatar(av)}
                      className={`text-2xl p-1.5 rounded-xl hover:bg-white/5 transition ${
                        avatar === av ? 'bg-[#C5A059]/20 border border-[#C5A059]/60 scale-110' : 'bg-transparent border border-transparent'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field Inputs */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Nama Panggilan</label>
                <input
                  type="text"
                  placeholder="Misal: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/5 focus:border-[#C5A059]/80 focus:ring-1 focus:ring-[#C5A059]/80 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold font-sans">Umur</label>
                  <span className="text-xs font-serif font-bold text-[#C5A059] italic">{age} Tahun</span>
                </div>
                <input
                  type="range"
                  min="17"
                  max="60"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Selected Hobbies */}
        {step === 2 && (
          <div className="animate-fade-in space-y-5 mt-4">
            <div className="space-y-1">
              <p className="text-[#C5A059] font-serif italic text-sm">Temukan circle kamu</p>
              <h2 className="text-2xl font-normal font-serif text-white tracking-tight flex items-center gap-2">
                Hobi & Ketertarikan <Sparkles className="w-5 h-5 text-[#C5A059]" />
              </h2>
              <p className="text-xs text-white/50 leading-relaxed">
                Pilih setidaknya 1 hobi yang ingin kamu lakukan bersama teman barumu dalam group kecil 2-5 orang.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {HOBBY_LIST.map((hobby) => {
                const isSelected = selectedHobbies.includes(hobby.name);
                return (
                  <button
                    key={hobby.name}
                    id={`hobby-btn-${hobby.name.replace(/\s+/g, '-')}`}
                    onClick={() => toggleHobby(hobby.name)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition duration-200 outline-none select-none ${
                      isSelected
                        ? 'bg-[#C5A059]/10 border-[#C5A059]/50 shadow-[0_0_12px_rgba(197,160,89,0.15)] text-white'
                        : 'bg-[#1a1a1a]/60 border-white/5 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <span className="text-2xl leading-none">{hobby.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-none font-bold truncate">{hobby.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium truncate mt-1">{hobby.category}</p>
                    </div>
                    {isSelected && (
                      <span className="bg-[#C5A059] text-[#0a0a0a] rounded-full p-0.5 shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {selectedHobbies.length > 0 && (
              <p className="text-[10px] text-white/60 bg-[#C5A059]/5 border border-[#C5A059]/20 p-2.5 rounded-xl flex items-center gap-2 font-serif italic">
                <span>🧁</span> <span>Keren! Kamu memilih <strong>{selectedHobbies.length} hobi</strong>. Algoritma akan mencari lobi yang sesuai.</span>
              </p>
            )}
          </div>
        )}

        {/* STEP 3: Skill & Vibe Personality */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6 mt-4">
            <div className="space-y-1">
              <p className="text-[#C5A059] font-serif italic text-sm">Sains Kompatibilitas 🧪</p>
              <h2 className="text-2xl font-normal font-serif text-white tracking-tight">
                Refined Matching
              </h2>
              <p className="text-xs text-white/50 leading-relaxed">
                Tentukan kemahiran & gaya bermain/interaksi kamu agar tidak terjadi awkwardness (kecanggungan) saat meetup.
              </p>
            </div>

            {/* Skill Level Selection */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold flex items-center gap-1.5 font-mono">
                <Compass className="w-3.5 h-3.5 text-[#C5A059]" /> Tingkat Skill Hobi kamu
              </label>
              
              <div className="flex gap-2">
                {([
                  { level: 'Beginner', desc: 'Nyoba hal baru, minim pengalaman' },
                  { level: 'Intermediate', desc: 'Sudah biasa, lumayan mahir' },
                  { level: 'Pro', desc: 'Sangat jago, mencari kompetisi' }
                ] as const).map(({ level, desc }) => (
                  <button
                    key={level}
                    onClick={() => setSkillLevel(level)}
                    className={`flex-1 text-center p-3 rounded-xl border transition flex flex-col items-center justify-center select-none ${
                      skillLevel === level
                        ? 'bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059]'
                        : 'bg-[#1a1a1a]/60 border-white/5 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold leading-none">{level}</span>
                    <span className="text-[8px] mt-1.5 opacity-80 leading-snug">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vibe selection */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold flex items-center gap-1.5 font-mono">
                <Smile className="w-3.5 h-3.5 text-[#C5A059]" /> Vibe Kepribadian kamu
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { mode: 'Relaxed', icon: '🍃', desc: 'Santai & Chill' },
                  { mode: 'Competitive', icon: '🏆', desc: 'Hantam Menang' },
                  { mode: 'Social', icon: '💬', desc: 'Cari Circle Baru' }
                ].map(({ mode, icon, desc }) => (
                  <button
                    key={mode}
                    onClick={() => setVibe(mode as VibePreference)}
                    className={`text-center p-3 rounded-xl border transition flex flex-col items-center justify-center select-none ${
                      vibe === mode
                        ? 'bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059]'
                        : 'bg-[#1a1a1a]/60 border-white/5 text-slate-400'
                    }`}
                  >
                    <span className="text-xl mb-1">{icon}</span>
                    <span className="text-xs font-bold leading-none">{mode === 'Relaxed' ? 'Santai' : mode === 'Competitive' ? 'Kompetitif' : 'Sosialis'}</span>
                    <span className="text-[8px] opacity-70 mt-1">{desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Weekly Slot Calendar */}
        {step === 4 && (
          <div className="animate-fade-in space-y-5 mt-4">
            <div className="space-y-1">
              <p className="text-[#C5A059] font-serif italic text-sm">Kalender ketersediaan</p>
              <h2 className="text-2xl font-normal font-serif text-white tracking-tight flex items-center gap-2">
                Pilih Overlap Jadwal <Calendar className="w-5 h-5 text-[#C5A059]" />
              </h2>
              <p className="text-xs text-white/50 leading-relaxed">
                Tentukan hari & jam kosongmu dalam seminggu untuk memudahkan AI menyelaraskan jadwal otomatis.
              </p>
            </div>

            {/* Calendar Scheduling Grid */}
            <div className="bg-[#1a1a1a]/80 border border-white/5 p-4 rounded-2xl space-y-4">
              <div className="text-center pb-2 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300">Slot Mingguan Kamu</span>
                <span className="text-[10px] text-[#C5A059] font-mono">Ketuk untuk pilih slot</span>
              </div>

              <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1 no-scrollbar">
                {DAYS_OF_WEEK.map((day) => {
                  const activeSlots = availability[day] || [];
                  return (
                    <div key={day} className="space-y-1.5 pb-2 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-200">{day}</span>
                        {activeSlots.length > 0 && (
                          <span className="text-[9px] bg-[#0a0a0a] px-1.5 py-0.5 rounded text-[#C5A059] font-mono">
                            {activeSlots.length} slot
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = activeSlots.includes(slot);
                          const slotLabel = slot.split(' ')[0]; // E.g., 'Pagi'
                          const slotHours = slot.substring(slot.indexOf('(')); // E.g., '(06:00 - 11:00)'

                          return (
                            <button
                              key={slot}
                              onClick={() => toggleAvailability(day, slot)}
                              className={`text-left px-2.5 py-2 rounded-lg border text-xs flex justify-between items-center transition select-none ${
                                isSelected
                                  ? 'bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059] shadow-sm'
                                  : 'bg-[#0a0a0a] border-white/5 text-slate-500 hover:border-white/10'
                              }`}
                            >
                              <div>
                                <span className="font-semibold block">{slotLabel}</span>
                                <span className="text-[8px] opacity-65 font-mono">{slotHours}</span>
                              </div>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] inline-block shrink-0"></span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: AI Profiling Review */}
        {step === 5 && (
          <div className="animate-fade-in space-y-5 mt-4">
            <div className="space-y-1 text-center">
              <p className="text-[#C5A059] font-serif italic text-sm">Analisis Matchmaker Selesai</p>
              <h2 className="text-2xl font-normal font-serif text-white tracking-tight">
                Review Profil Loopin ✨
              </h2>
              <p className="text-xs text-white/50 leading-relaxed">
                AI Matchmaker telah menganalisis profil Anda. Berikut identitas sosial digital Anda:
              </p>
            </div>

            {/* Profile ID Card Presentation */}
            <div className="bg-[#1a1a1a] border border-white/5 p-5 rounded-3xl relative shadow-[0_10px_35px_rgba(0,0,0,0.6)] overflow-hidden mt-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center gap-3 w-full pb-4 border-b border-white/5">
                <span className="text-4xl p-2 bg-[#0a0a0a] rounded-2xl border border-white/5 leading-none select-none">
                  {avatar}
                </span>
                <div>
                  <h3 className="text-base font-normal font-serif text-white flex items-center gap-1.5 leading-snug">
                    {name || 'Tanpa Nama'} <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] font-mono select-none">Verified</span>
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono font-semibold">
                    {age} Tahun • {vibe === 'Relaxed' ? 'Santai🍃' : vibe === 'Competitive' ? 'Kompetitif🏆' : 'Sosialis💬'}
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 pt-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block font-mono font-semibold">Kemahiran Hobi</span>
                  <span className="text-xs bg-[#0a0a0a] text-[#C5A059] font-semibold px-2.5 py-1 rounded-md border border-[#C5A059]/20 inline-block font-mono">
                    {skillLevel} Class
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block font-mono font-semibold">Hobi Terpilih</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedHobbies.map((h) => {
                      const matchingHobby = HOBBY_LIST.find(item => item.name === h);
                      return (
                        <span key={h} className="text-[10px] font-medium bg-[#0a0a0a] text-white/85 px-2.5 py-0.5 rounded-lg border border-white/5 flex items-center gap-1">
                          <span>{matchingHobby?.icon || '⭐'}</span>
                          <span>{h}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block font-mono font-semibold">Jadwal Utama</span>
                  <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto no-scrollbar pt-1">
                    {Object.entries(availability).map(([day, slotsVal]) => {
                      const slots = slotsVal as any[];
                      if (slots.length === 0) return null;
                      return (
                        <div key={day} className="text-[9px] bg-[#0a0a0a] border border-white/5 rounded px-2 py-0.5 text-white/70 flex items-center gap-1 shrink-0">
                          <span className="font-semibold text-[#C5A059]">{day}</span>
                          <span className="opacity-20">|</span>
                          <span className="truncate text-white/60">{slots.map(s => s.split(' ')[0]).join(', ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-white/40 text-center flex items-center justify-center gap-1.5 bg-[#1a1a1a]/40 p-3 border border-white/5 rounded-2xl">
              <Zap className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>Tekan tombol di bawah untuk melontarkan Matchmaker AI dan mulai mencari jodoh hobi kamu!</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex gap-3 z-10 border-t border-white/5 pt-4 bg-[#0a0a0a] shrink-0">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex-1 bg-[#1a1a1a] hover:bg-[#222] text-white/60 font-semibold text-xs py-3 px-4 rounded-xl transition border border-white/5 active:scale-95 cursor-pointer animate-fade-in"
          >
            Kembali
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`flex-2 py-3 px-6 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 select-none outline-none cursor-pointer ${
            isStepValid()
              ? 'bg-[#C5A059] hover:bg-[#d8b473] text-[#0a0a0a] shadow-[0_4px_16px_rgba(197,160,89,0.2)] active:scale-95'
              : 'bg-[#1a1a1a] text-white/20 border border-white/5 cursor-not-allowed'
          }`}
        >
          <span>{step === 5 ? 'Masuk ke Loopin!' : 'Lanjut'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
