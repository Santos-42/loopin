import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Message, Lobby, DAYS_OF_WEEK, TIME_SLOTS, INDONESIAN_BAD_WORDS, SYSTEM_BOT_ANSWERS } from '../types';
import { Send, MapPin, Calendar, Clock, VolumeX, ShieldAlert, Sparkles, MessageCircle, Star, LogOut, CheckCircle, ArrowLeft, Trophy } from 'lucide-react';

interface LobbiesProps {
  userProfile: any;
  activeLobby: Lobby | null;
  onLeaveLobby: () => void;
  onAddStreak: (points: number) => void;
}

export default function Lobbies({ userProfile, activeLobby, onLeaveLobby, onAddStreak }: LobbiesProps) {
  // Local state for the selected lobby (populated with defaults if none active)
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [inputText, setInputText] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningReason, setWarningReason] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  // Rating form states
  const [ratingVal, setRatingVal] = useState(5);
  const [givedBadge, setGivedBadge] = useState('Reliable');

  // AI recommendations states
  const [showScheduleEngine, setShowScheduleEngine] = useState(false);
  const [showVenueEngine, setShowVenueEngine] = useState(false);
  
  // Thread system
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeLobby) {
      setLobby(activeLobby);
    } else {
      // Build a default standby Lobby with some mock guys for demonstration
      const partner1 = {
        id: 'user-p1',
        name: 'Indah Savitri',
        avatar: '👩‍🦰',
        age: 24,
        hobbies: ['Badminton', 'Cafe Hopping'],
        skillLevel: 'Intermediate' as any,
        vibe: 'Social' as any,
        availability: { 'Sabtu': ['Sore (15:00 - 18:00)'] },
        bio: 'Mabar seru!',
        location: 'Kemang, Jakarta',
        locationCoord: { lat: -6.2731, lng: 106.8122 },
        rating: 4.9,
        reviewsCount: 12,
        reputationBadge: 'Super Star',
        isVerified: true,
        membership: 'Free' as any
      };

      const partner2 = {
        id: 'user-p2',
        name: 'Gilang Dirga',
        avatar: '👦',
        age: 26,
        hobbies: ['Badminton'],
        skillLevel: 'Intermediate' as any,
        vibe: 'Social' as any,
        availability: { 'Sabtu': ['Sore (15:00 - 18:00)'] },
        bio: 'Smash lurus saja.',
        location: 'Sudirman, Jakarta',
        locationCoord: { lat: -6.2197, lng: 106.8163 },
        rating: 4.8,
        reviewsCount: 15,
        reputationBadge: 'Always punctual',
        isVerified: true,
        membership: 'Free' as any
      };

      const defaultLobby: Lobby = {
        id: 'LOOPIN-5284',
        title: 'Micro-Group Badminton Kemang',
        hobby: 'Badminton',
        skillLevel: 'Intermediate',
        vibe: 'Social',
        members: [partner1, partner2],
        messages: [
          {
            id: 'msg-init-1',
            senderId: 'user-p1',
            senderName: 'Indah Savitri',
            senderAvatar: '👩‍🦰',
            text: 'Halo teman-teman! Makasih udah match ya. Yuk kita setup tanding badminton minggu ini 🏸',
            timestamp: '11:20 AM',
            isSystem: false
          },
          {
            id: 'msg-init-2',
            senderId: 'user-p2',
            senderName: 'Gilang Dirga',
            senderAvatar: '👦',
            text: 'Halo Indah! Salam kenal semuanya. Aku siap kapan aja nih, hobi Badminton emang ga ada matinya!',
            timestamp: '11:21 AM',
            isSystem: false
          }
        ],
        status: 'Negotiating',
        scheduleConfirmedList: [],
        venueConfirmedList: [],
        scheduleConfirmedCount: 0
      };
      setLobby(defaultLobby);
    }
  }, [activeLobby]);

  // Keep chat scrolled down
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [lobby?.messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !lobby) return;

    let cleanText = inputText;
    let containsThreat = false;
    let detectedWord = '';

    // Step 5: Toxic and abusive word detection algorithm
    INDONESIAN_BAD_WORDS.forEach((badWord) => {
      const regex = new RegExp(`\\b${badWord}\\b`, 'gi');
      if (regex.test(cleanText)) {
        containsThreat = true;
        detectedWord = badWord;
        cleanText = cleanText.replace(regex, '****');
      }
    });

    const userMsg: Message = {
      id: `usr-msg-${Date.now()}`,
      senderId: 'user-me',
      senderName: userProfile.name || 'Saya',
      senderAvatar: userProfile.avatar || '🧑‍🚀',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: false,
      isToxicCensored: containsThreat
    };

    const updatedMessages = [...lobby.messages, userMsg];

    if (containsThreat) {
      setWarningReason(`Sistem AI mendeteksi muatan kata kasar "${detectedWord}". Lobi dilarang menggunakan kata kotor agar pertemanan tetap ramah dan nyaman.`);
      setShowWarningModal(true);

      updatedMessages.push({
        id: `sys-warn-${Date.now()}`,
        senderId: 'loopin-safety',
        senderName: 'Loopin Safety Guard 🛡️',
        senderAvatar: '🤖',
        text: `⚠️ PERINGATAN ETIKA: Anggota "${userProfile.name}" menggunakan kata yang disensor. Tolong pertahankan interaksi yang ramah bebas toxic demi kenyamanan beramai-ramai!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      });
    }

    setLobby({
      ...lobby,
      messages: updatedMessages
    });

    setInputText('');

    if (!containsThreat) {
      setTimeout(() => {
        const randomAnswer = SYSTEM_BOT_ANSWERS[Math.floor(Math.random() * SYSTEM_BOT_ANSWERS.length)];
        const speakingMember = lobby.members[Math.floor(Math.random() * lobby.members.length)];
        
        const replyMsg: Message = {
          id: `reply-msg-${Date.now()}`,
          senderId: speakingMember.id,
          senderName: speakingMember.name,
          senderAvatar: speakingMember.avatar,
          text: randomAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: false
        };

        setLobby(currentLobby => {
          if (!currentLobby) return null;
          return {
            ...currentLobby,
            messages: [...currentLobby.messages, replyMsg]
          };
        });
      }, 1400);
    }
  };

  const handleRecommendBestTime = () => {
    if (!lobby) return;
    
    setShowScheduleEngine(true);
    
    setTimeout(() => {
      setLobby(curr => {
        if (!curr) return null;
        return {
          ...curr,
          suggestedSchedule: { day: 'Sabtu', slot: 'Sore (15:00 - 18:00)' },
          messages: [
            ...curr.messages,
            {
              id: `sys-time-recom-${Date.now()}`,
              senderId: 'loopin-ai',
              senderName: 'Lobby Matchmaker AI 🚀',
              senderAvatar: '🔮',
              text: '📅 REKOMENDASI JADWAL TERBAIK: AI menganalisis kalender semua anggota kelompok ini. Waktu libur paling pas (overlap tinggi) adalah hari SABTU SORE (15:00 - 18:00). Silakan konfirmasi di bawah!',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isSystem: true
            }
          ]
        };
      });
    }, 850);
  };

  const handleRecommendMidpointVenue = () => {
    if (!lobby) return;
    
    setShowVenueEngine(true);

    let venueName = 'Sudirman Sports Hall';
    if (lobby.hobby === 'Cafe Hopping') venueName = 'Anomali Coffee Kemang';
    else if (lobby.hobby === 'Board Games') venueName = 'Cove Over BoardGames Cafe, Senopati';
    else if (lobby.hobby === 'Pottery / Tanah Liat') venueName = 'Clay Space Studio, Melawai';
    else if (lobby.hobby === 'Jogging Pagi') venueName = 'Gelora Bung Karno Center Park';

    setTimeout(() => {
      setLobby(curr => {
        if (!curr) return null;
        return {
          ...curr,
          suggestedVenue: venueName,
          messages: [
            ...curr.messages,
            {
              id: `sys-loc-recom-${Date.now()}`,
              senderId: 'loopin-ai',
              senderName: 'Lobby Matchmaker AI 🚀',
              senderAvatar: '🧭',
              text: `📍 REKOMENDASI TITIK TENGAH (MIDPOINT): Semua anggota tinggal atau berkantor di daerah Jaksel/Pusat. Titik tengah optimal adalah "${venueName}". Jarak tempuh adil bersahabat!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isSystem: true
            }
          ]
        };
      });
    }, 1100);
  };

  const handleConfirmEvent = () => {
    if (!lobby) return;
    
    setLobby({
      ...lobby,
      status: 'Confirmed',
      messages: [
        ...lobby.messages,
        {
          id: `sys-conf-ok-${Date.now()}`,
          senderId: 'loopin-ai',
          senderName: 'Loopin Moderator 🛡️',
          senderAvatar: '⭐',
          text: `🎉 LOBBY STATUS: RESMI DIKONFIRMASI! Semua anggota setuju berkumpul di "${lobby.suggestedVenue || 'Hall Olahraga Lobi'}" pada hari ${lobby.suggestedSchedule?.day || 'Sabtu'} ${lobby.suggestedSchedule?.slot || 'Sore'}. Selamat mabar spontan!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true
        }
      ]
    });
  };

  const handleFinishMeetup = () => {
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    setShowRatingModal(false);
    onAddStreak(30);

    if (lobby) {
      setLobby({
        ...lobby,
        status: 'Finished',
        messages: [
          ...lobby.messages,
          {
            id: `sys-meetup-done-${Date.now()}`,
            senderId: 'loopin-ai',
            senderName: 'Loopin Platform 🏆',
            senderAvatar: '🎖️',
            text: `🥳 PERTEMUAN SUKSES! Anda memberikan rating ${ratingVal} ⭐ serta lencana "${givedBadge}" ke anggota tim. Level reputasi & streak andalan Anda meningkat pesat!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystem: true
          }
        ]
      });
    }
  };

  if (!lobby) {
    return <div className="p-6 text-center text-slate-400 bg-[#0a0a0a] min-h-screen">Memuat lobi...</div>;
  }

  const allMembers = [
    { name: 'Anda (Saya)', avatar: userProfile.avatar, isVerified: true, badge: 'Streak Champion', level: userProfile.skillLevel, vibe: userProfile.vibe },
    ...lobby.members.map(m => ({
      name: m.name,
      avatar: m.avatar,
      isVerified: m.isVerified,
      badge: m.reputationBadge,
      level: m.skillLevel,
      vibe: m.vibe
    }))
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0a0a0a] text-slate-100 z-10 relative overflow-hidden">
      
      {/* Lobby Header elements */}
      <div className="px-4 py-3 border-b border-white/5 bg-[#0a0a0a]/90 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          {activeLobby && (
            <button onClick={onLeaveLobby} className="p-1 hover:bg-[#1a1a1a] rounded-lg text-white/50 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h3 className="text-xs font-normal text-[#C5A059] tracking-tight leading-none flex items-center gap-1.5 font-mono">
              <span>{lobby.hobby} Lobby</span>
              <span className="text-[9px] bg-[#1a1a1a] px-1.5 py-0.5 rounded text-white/80 font-mono border border-white/5">
                {lobby.id}
              </span>
            </h3>
            <p className="text-[11px] font-normal font-serif text-white truncate max-w-[170px] mt-1.5">{lobby.title}</p>
          </div>
        </div>

        {/* Status indicator badge */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[8px] font-semibold tracking-wide uppercase font-mono px-2 py-0.5 rounded-full select-none ${
            lobby.status === 'Confirmed'
              ? 'bg-emerald-500/10 border border-emerald-500/35 text-emerald-400'
              : lobby.status === 'Finished'
              ? 'bg-[#C5A059]/10 border border-[#C5A059]/35 text-[#C5A059]'
              : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 animate-pulse'
          }`}>
            {lobby.status === 'Negotiating' ? 'Diskusi' : lobby.status === 'Confirmed' ? 'Sah!' : 'Selesai'}
          </span>
          <button
            onClick={onLeaveLobby}
            className="p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#C5A059] border border-white/5 cursor-pointer"
            title="Keluar dari Lobi"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Participants Quick Header Dock */}
      <div className="bg-[#1a1a1a]/30 p-2.5 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[8px] uppercase tracking-wider text-white/40 font-mono font-semibold shrink-0 select-none">Anggota ({allMembers.length}):</span>
        <div className="flex gap-2">
          {allMembers.map((m, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-xl px-2.5 py-0.5 flex items-center gap-1.5 shrink-0 select-none">
              <span className="text-xs leading-none">{m.avatar}</span>
              <div>
                <span className="text-[9px] font-medium text-white block leading-tight">{m.name.split(' ')[0]}</span>
                <span className="text-[7.5px] text-white/40 block leading-tight font-mono">{m.level} • {m.vibe === 'Relaxed' ? 'Santai' : m.vibe === 'Competitive' ? 'Kompetitif' : 'Sosialis'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat scroll content frame */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 bg-[#0a0a0a]">
        
        {/* Info Notification Box */}
        <div className="bg-[#1a1a1a]/40 border border-white/5 p-3 rounded-2xl text-center space-y-0.5 block">
          <span className="text-[10px] font-medium text-[#C5A059] block font-serif">✨ Smart Match Lobi Berkelompok</span>
          <p className="text-[9px] text-white/50 leading-relaxed font-sans">
            Gunakan tombol AI di bawah untuk menganalisis waktu bersama dan merekomendasikan titik tengah yang adil.
          </p>
        </div>

        {/* Chat message timeline */}
        {lobby.messages.map((msg) => {
          const isMe = msg.senderId === 'user-me';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 max-w-[280px] ${
                isMe ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className="w-6.5 h-6.5 rounded-lg bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-xs shrink-0 select-none">
                {msg.senderAvatar}
              </div>

              <div className="space-y-1">
                <span className={`text-[8px] tracking-wide font-mono block ${isMe ? 'text-right text-[#C5A059]' : 'text-white/40'}`}>
                  {msg.senderName} <span className="opacity-40 ml-1 font-normal font-mono">{msg.timestamp}</span>
                </span>
                
                <div className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.isSystem
                    ? 'bg-[#1a1a1a] border border-[#C5A059]/15 text-[#C5A059]/90 font-serif text-[11px]'
                    : msg.isToxicCensored
                    ? 'bg-rose-950/20 border border-rose-500/30 text-rose-400 italic font-mono'
                    : isMe
                    ? 'bg-[#C5A059]/10 border border-[#C5A059]/25 text-white rounded-tr-none shadow-[0_4px_12px_rgba(197,160,89,0.05)]'
                    : 'bg-[#1a1a1a] border border-white/5 text-white/90 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendations action tray */}
      <div className="px-4 py-2.5 border-t border-white/5 bg-[#1a1a1a]/20 shrink-0 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[8px] uppercase tracking-wider font-mono font-bold text-white/40 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Mode Rekomendasi Loopin AI
          </span>
          {lobby.status === 'Negotiating' && lobby.suggestedSchedule && lobby.suggestedVenue && (
            <span className="text-[8px] bg-[#C5A059]/10 text-[#C5A059] px-1.5 py-0.5 rounded font-bold font-mono">Siap Berangkat!</span>
          )}
        </div>

        {lobby.status === 'Negotiating' ? (
          <div className="flex gap-2">
            <button
              onClick={handleRecommendBestTime}
              className={`flex-1 text-[10px] py-1.5 px-3 border rounded-xl font-medium tracking-wide flex items-center justify-center gap-1 shadow-sm transition outline-none cursor-pointer font-mono ${
                showScheduleEngine
                  ? 'bg-[#C5A059]/10 border-[#C5A059]/50 text-[#C5A059]'
                  : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 text-white/80'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              {showScheduleEngine ? 'Jadwal ✔️' : 'AI Cari Jadwal'}
            </button>
            <button
              onClick={handleRecommendMidpointVenue}
              className={`flex-1 text-[10px] py-1.5 px-3 border rounded-xl font-medium tracking-wide flex items-center justify-center gap-1 shadow-sm transition outline-none cursor-pointer font-mono ${
                showVenueEngine
                  ? 'bg-[#C5A059]/10 border-[#C5A059]/50 text-[#C5A059]'
                  : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 text-white/80'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              {showVenueEngine ? 'Mako ✔️' : 'AI Cari Lokasi'}
            </button>
          </div>
        ) : lobby.status === 'Confirmed' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/35 p-2 rounded-xl flex items-center justify-between text-[10.5px] text-emerald-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span className="font-mono text-[9px] tracking-wide uppercase">Aktivitas Terkonfirmasi!</span>
            </div>
            <button
              onClick={handleFinishMeetup}
              className="bg-[#C5A059] text-[#0a0a0a] font-semibold px-2.5 py-1 text-[9px] rounded-lg hover:bg-[#d8b473] cursor-pointer font-mono shadow-sm"
            >
              SELESAI
            </button>
          </div>
        ) : (
          <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 p-2 rounded-xl text-center text-[#C5A059] text-[10px] flex justify-center items-center gap-1.5 font-serif">
            <Trophy className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Aktivitas selesai & dinilai! Reputasi meningkat. 🎉</span>
          </div>
        )}

        {/* Prompt to officially confirm is both schedule & location suggestions are completed */}
        {lobby.status === 'Negotiating' && lobby.suggestedSchedule && lobby.suggestedVenue && (
          <button
            onClick={handleConfirmEvent}
            className="w-full bg-[#C5A059] hover:bg-[#d8b473] text-[#0a0a0a] font-semibold text-xs py-2 px-4 rounded-xl shadow-lg transition active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer font-serif"
          >
            <span>Konfirmasi Jadwal & Lokasi Bersama 🤝</span>
          </button>
        )}
      </div>

      {/* Input keyboard message typing tray */}
      <div className="p-3 border-t border-white/5 bg-[#0a0a0a] flex gap-2 items-center shrink-0">
        <input
          type="text"
          placeholder="Ketik pesan lobi..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-[#1a1a1a] border border-white/5 focus:border-[#C5A059]/30 rounded-xl px-4 py-2 text-xs text-white outline-none transition"
        />
        <button
          onClick={handleSendMessage}
          className="w-9 h-9 bg-[#C5A059] hover:bg-[#d8b473] hover:scale-105 active:scale-95 text-[#0a0a0a] rounded-xl flex items-center justify-center shadow-md transition duration-200 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* AI TOXIC ETHICAL POLICIES POPUP WARNING MODAL */}
      {showWarningModal && (
        <div className="absolute inset-0 bg-[#0a0a0a]/95 flex items-center justify-center p-6 z-50 animate-fade-in select-none">
          <div className="bg-[#1a1a1a] border border-white/5 p-5 rounded-3xl max-w-xs space-y-4 shadow-2xl relative overflow-hidden text-center text-slate-100">
            <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-500 mx-auto">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-sm font-medium font-serif text-rose-400">Pendeteksian Bahasa Kasar</h4>
              <p className="text-[10px] text-white/50 leading-relaxed text-left">
                {warningReason}
              </p>
              <div className="bg-[#0a0a0a]/65 p-2 border border-white/5 text-[9px] text-white/40 italic rounded-xl font-sans mt-2">
                "Loopin menjamin rasa aman (Trust & Safety) saat bertemu hobi baru."
              </div>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-[#C5A059] text-[#0a0a0a] font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* MEETUP SUCCESS COMPLETED XP RATING FEEDBACK POPUP */}
      {showRatingModal && (
        <div className="absolute inset-0 bg-[#0a0a0a]/95 flex items-center justify-center p-6 z-50 animate-fade-in select-none">
          <div className="bg-[#1a1a1a] border border-white/5 p-5 rounded-3xl max-w-xs space-y-4 shadow-2xl text-slate-100 relative overflow-hidden w-full">
            
            <div className="text-center space-y-1">
              <h4 className="text-sm font-medium font-serif text-[#C5A059]">Nilai Kualitas Pertemuan 🏆</h4>
              <p className="text-[10px] text-white/50 leading-relaxed">
                Seberapa asyik & handal kah anggota kelompok lobi ini? Hubungan dan feedback positif menaikkan lencana andalan.
              </p>
            </div>

            {/* Stars selection rating */}
            <div className="flex justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingVal(star)}
                  className="p-1 focus:outline-none cursor-pointer"
                >
                  <Star className={`w-6 h-6 ${star <= ratingVal ? 'text-[#C5A059] fill-[#C5A059]' : 'text-white/10'}`} />
                </button>
              ))}
            </div>

            {/* Badge reward assignment */}
            <div className="space-y-1.5">
              <span className="text-[8px] uppercase tracking-wider font-mono font-semibold text-white/45 block text-center">Beri Lencana Karakter Teman</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'Reliable', label: 'Tepat Waktu ⏱️' },
                  { key: 'Friendly', label: 'Ramah Banget 😊' },
                  { key: 'Smasher', label: 'Pro Skill 🔥' },
                  { key: 'GoodVibe', label: 'Asyik Pol 💬' }
                ].map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setGivedBadge(b.key)}
                    className={`p-2 rounded-xl border text-center font-medium font-sans text-[10px] cursor-pointer transition ${
                      givedBadge === b.key
                        ? 'bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059]'
                        : 'bg-[#0a0a0a] border-white/5 text-white/40'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmitRating}
              className="w-full bg-[#C5A059] text-[#0a0a0a] font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer"
            >
              Kirim Feedback & Ambil Lencana
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
