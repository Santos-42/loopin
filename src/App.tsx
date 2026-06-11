/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import PhoneFrame from './components/PhoneFrame';
import Onboarding from './components/Onboarding';
import MatchDiscovery from './components/MatchDiscovery';
import Lobbies from './components/Lobbies';
import Rewards from './components/Rewards';
import Premium from './components/Premium';
import { UserProfile, Lobby, MOCK_ACHIEVEMENT_LIST } from './types';
import { Compass, MessageSquare, Trophy, Crown, Sparkles } from 'lucide-react';

export default function App() {
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'match' | 'lobbies' | 'rewards' | 'premium'>('match');
  const [activeLobby, setActiveLobby] = useState<Lobby | null>(null);
  const [streak, setStreak] = useState(3); // Default streak of 3 days
  const [achievements, setAchievements] = useState(MOCK_ACHIEVEMENT_LIST);
  const [isPremium, setIsPremium] = useState(false);

  // Completed onboarding session callback
  const handleOnboardingComplete = (profileData: any) => {
    setUserProfile(profileData);
    setActiveTab('match');
  };

  // Triggers when user likes/swipes right and matching triggers a successful lobby room binding
  const handleJoinLobby = (hobbyName: string, partner: UserProfile, compatibilityScore: number) => {
    // Generate a unique Lobby UUID
    const randomLobbyId = `LOOPIN-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newLobby: Lobby = {
      id: randomLobbyId,
      title: `Micro-Group ${hobbyName} (${userProfile.name} & ${partner.name})`,
      hobby: hobbyName,
      skillLevel: userProfile.skillLevel,
      vibe: userProfile.vibe,
      members: [partner],
      messages: [
        {
          id: 'sys-joined-init',
          senderId: 'loopin-ai',
          senderName: 'Lobby Bot 🔮',
          senderAvatar: '🤖',
          text: `🎉 Selamat datang di lobi mikro-grup ${hobbyName}! Anda dipertemukan dengan ${partner.name} karena kecocokan AI tinggi (${compatibilityScore}%). Mulailah berdiskusi secara nyaman!`,
          timestamp: 'Sekarang',
          isSystem: true
        }
      ],
      status: 'Negotiating',
      scheduleConfirmedList: [],
      venueConfirmedList: [],
      scheduleConfirmedCount: 0
    };

    setActiveLobby(newLobby);
    setActiveTab('lobbies');
  };

  const handleLeaveLobby = () => {
    setActiveLobby(null);
  };

  const handleAddStreak = (points: number) => {
    setStreak(prev => prev + 1);
    
    // Dynamically unlock "Spontan Berkeringat" achievement if streak increases
    setAchievements(prev => 
      prev.map(ach => {
        if (ach.id === 'ach-2') {
          const nextProgress = Math.min(ach.progress + 1, ach.maxProgress);
          return {
            ...ach,
            progress: nextProgress,
            unlocked: nextProgress >= ach.maxProgress
          };
        }
        return ach;
      })
    );
  };

  const handleUpgradeSuccess = () => {
    setIsPremium(true);
  };

  return (
    <PhoneFrame>
      {!userProfile ? (
        /* ONBOARDING STEP FLOW */
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        /* HOMEPAGE WRAPPER WITH NAVIGATION BAR */
        <div className="flex-1 flex flex-col justify-between h-full bg-[#0a0a0a] text-slate-200">
          
          {/* Main App Content Body viewport */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {activeTab === 'match' && (
              <MatchDiscovery
                userProfile={userProfile}
                onJoinLobby={handleJoinLobby}
                onNavigateToPremium={() => setActiveTab('premium')}
              />
            )}

            {activeTab === 'lobbies' && (
              <Lobbies
                userProfile={userProfile}
                activeLobby={activeLobby}
                onLeaveLobby={handleLeaveLobby}
                onAddStreak={handleAddStreak}
              />
            )}

            {activeTab === 'rewards' && (
              <Rewards
                streak={streak}
                achievements={achievements}
              />
            )}

            {activeTab === 'premium' && (
              <Premium
                isPremium={isPremium}
                onUpgradeSuccess={handleUpgradeSuccess}
              />
            )}
          </div>

          {/* SATELLITE NAVIGATION TAB BAR */}
          <div className="bg-[#1a1a1a] border-t border-white/5 px-6 py-2.5 flex justify-between items-center z-30 shrink-0 select-none">
            
            {/* MATCH TAB BUTTON */}
            <button
              onClick={() => setActiveTab('match')}
              className={`flex flex-col items-center gap-1 focus:outline-none transition-all outline-none cursor-pointer ${
                activeTab === 'match' ? 'text-[#C5A059] scale-105 font-medium' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[9px] uppercase tracking-wider font-mono font-semibold">Match</span>
            </button>

            {/* LOBBIES / ACTIVE CHAT HUB NAVIGATION BUTTON */}
            <button
              onClick={() => setActiveTab('lobbies')}
              className={`flex flex-col items-center gap-1 focus:outline-none transition-all outline-none cursor-pointer relative ${
                activeTab === 'lobbies' ? 'text-[#C5A059] scale-105 font-medium' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[9px] uppercase tracking-wider font-mono font-semibold">Lobi</span>
              {activeLobby && (
                <span className="absolute top-0 right-1 w-2 h-2 bg-[#C5A059] rounded-full border border-[#1a1a1a] animate-pulse"></span>
              )}
            </button>

            {/* REWARDS & GAMIFICATIONS TAB BUTTON */}
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex flex-col items-center gap-1 focus:outline-none transition-all outline-none cursor-pointer ${
                activeTab === 'rewards' ? 'text-[#C5A059] scale-105 font-medium' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="text-[9px] uppercase tracking-wider font-mono font-semibold">Reputasi</span>
            </button>

            {/* PREMIUM GATE NAV TAB BUTTON */}
            <button
              onClick={() => setActiveTab('premium')}
              className={`flex flex-col items-center gap-1 focus:outline-none transition-all outline-none cursor-pointer ${
                activeTab === 'premium' ? 'text-[#C5A059] scale-105 font-medium' : 'text-white/40 hover:text-white/80'
              }`}
            >
              <div className="relative">
                <Crown className="w-5 h-5" />
                {isPremium && (
                  <Sparkles className="w-3 h-3 text-[#C5A059] absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
                )}
              </div>
              <span className="text-[9px] uppercase tracking-wider font-mono font-semibold">Premium</span>
            </button>

          </div>

        </div>
      )}
    </PhoneFrame>
  );
}

