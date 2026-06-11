export type SkillLevel = 'Beginner' | 'Intermediate' | 'Pro';
export type VibePreference = 'Relaxed' | 'Competitive' | 'Social';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  hobbies: string[];
  skillLevel: SkillLevel;
  vibe: VibePreference;
  availability: { [day: string]: string[] }; // Day -> list of time slots: 'Pagi' | 'Siang' | 'Sore' | 'Malam'
  bio: string;
  location: string;
  locationCoord: { lat: number; lng: number }; // Relative coordinates for midpoint calculation
  rating: number;
  reviewsCount: number;
  reputationBadge: string; // e.g. "High Reliability", "Super Friendly"
  isVerified: boolean;
  membership: 'Free' | 'Premium';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isSystem: boolean;
  isToxicCensored?: boolean;
}

export interface Lobby {
  id: string; // e.g. LOOPIN-5341
  title: string;
  hobby: string;
  skillLevel: SkillLevel;
  vibe: VibePreference;
  members: UserProfile[];
  messages: Message[];
  suggestedSchedule?: { day: string; slot: string };
  suggestedVenue?: string;
  scheduleConfirmedCount: number; // how many members confirmed
  scheduleConfirmedList: string[]; // member ids
  venueConfirmedList: string[]; // member ids
  status: 'Negotiating' | 'Confirmed' | 'Finished';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  badgeName: string;
}

export const HOBBY_LIST = [
  { name: 'Badminton', icon: '🏸', category: 'Olahraga' },
  { name: 'Board Games', icon: '🎲', category: 'Sosial & Main' },
  { name: 'Jogging Pagi', icon: '🏃', category: 'Olahraga' },
  { name: 'Cafe Hopping', icon: '☕', category: 'Sosial & Main' },
  { name: 'Pottery / Tanah Liat', icon: '🏺', category: 'Seni & Kerajinan' },
  { name: 'Hiking Dadakan', icon: '🥾', category: 'Petualangan' },
  { name: 'Mobile Photography', icon: '📸', category: 'Seni & Kerajinan' },
  { name: 'Billiard', icon: '🎱', category: 'Sosial & Main' },
];

export const DAYS_OF_WEEK = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
export const TIME_SLOTS = ['Pagi (06:00 - 11:00)', 'Siang (11:00 - 15:00)', 'Sore (15:00 - 18:00)', 'Malam (19:00 - 22:00)'];

export const INDONESIAN_BAD_WORDS = [
  'anjing', 'babi', 'monyet', 'bangsat', 'bajingan', 'tolol', 'goblok', 'bodoh', 'penipu',
  'scam', 'harass', 'fucking', 'shit', 'perek', 'lonte', 'kasar', 'bego', 'geblek'
];

// Presets for AI Matchmaking
export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Sarah Utami',
    avatar: '👩‍🦰',
    age: 23,
    hobbies: ['Badminton', 'Cafe Hopping'],
    skillLevel: 'Intermediate',
    vibe: 'Social',
    availability: {
      'Sabtu': ['Sore (15:00 - 18:00)', 'Malam (19:00 - 22:00)'],
      'Minggu': ['Pagi (06:00 - 11:00)', 'Sore (15:00 - 18:00)']
    },
    bio: 'Cari temen mabar badminton Jakarta Selatan yang santai tapi tetep pengen keringetan! Abis itu yuk ngopi bareng ☕',
    location: 'Kemang, Jakarta Selatan',
    locationCoord: { lat: -6.2731, lng: 106.8122 },
    rating: 4.9,
    reviewsCount: 14,
    reputationBadge: 'Highly Reliable 🌟',
    isVerified: true,
    membership: 'Free'
  },
  {
    id: 'user-2',
    name: 'Andra Prayoga',
    avatar: '👨',
    age: 25,
    hobbies: ['Board Games', 'Billiard'],
    skillLevel: 'Intermediate',
    vibe: 'Relaxed',
    availability: {
      'Rabu': ['Malam (19:00 - 22:00)'],
      'Jumat': ['Malam (19:00 - 22:00)'],
      'Sabtu': ['Siang (11:00 - 15:00)', 'Sore (15:00 - 18:00)']
    },
    bio: 'Suka Catan sama Werewolf! Sering nongkrong di board game cafe di Jaksel. Santuy person, no baper-baper.',
    location: 'Sudirman, Jakarta Pusat',
    locationCoord: { lat: -6.2197, lng: 106.8163 },
    rating: 4.8,
    reviewsCount: 22,
    reputationBadge: 'Super Friendly 😊',
    isVerified: true,
    membership: 'Free'
  },
  {
    id: 'user-3',
    name: 'Aditya Fauzan',
    avatar: '👦',
    age: 22,
    hobbies: ['Badminton', 'Hiking Dadakan'],
    skillLevel: 'Pro',
    vibe: 'Competitive',
    availability: {
      'Sabtu': ['Pagi (06:00 - 11:00)', 'Sore (15:00 - 18:00)'],
      'Minggu': ['Pagi (06:00 - 11:00)']
    },
    bio: 'Mencari sparring partner badminton yang berani smash kencang! Lets match up and win or practice hard 🏸',
    location: 'Kuningan, Jakarta Selatan',
    locationCoord: { lat: -6.2241, lng: 106.8294 },
    rating: 4.7,
    reviewsCount: 8,
    reputationBadge: 'Skill Enthusiast 🔥',
    isVerified: true,
    membership: 'Free'
  },
  {
    id: 'user-4',
    name: 'Michelle Wijaya',
    avatar: '👩',
    age: 24,
    hobbies: ['Pottery / Tanah Liat', 'Cafe Hopping'],
    skillLevel: 'Beginner',
    vibe: 'Relaxed',
    availability: {
      'Kamis': ['Siang (11:00 - 15:00)'],
      'Sabtu': ['Siang (11:00 - 15:00)', 'Sore (15:00 - 18:00)']
    },
    bio: 'Pengen coba workshop pottery tapi temen-temenku ga ada yg mau. Cari tebengan studio pottery bareng di daerah Jaksel!',
    location: 'Senopati, Jakarta Selatan',
    locationCoord: { lat: -6.2235, lng: 106.8092 },
    rating: 5.0,
    reviewsCount: 19,
    reputationBadge: 'Amazing Communicator 💬',
    isVerified: true,
    membership: 'Premium'
  },
  {
    id: 'user-5',
    name: 'Bimo Wicaksono',
    avatar: '👨‍🦱',
    age: 26,
    hobbies: ['Jogging Pagi', 'Mobile Photography'],
    skillLevel: 'Intermediate',
    vibe: 'Social',
    availability: {
      'Selasa': ['Pagi (06:00 - 11:00)'],
      'Kamis': ['Pagi (06:00 - 11:00)'],
      'Minggu': ['Pagi (06:00 - 11:00)']
    },
    bio: 'Rutin lari di CFD atau GBK tiap minggu pagi. Senang ngobrol baru sambil cari angle foto HP yang estetis!',
    location: 'Bintaro, Tangerang Selatan',
    locationCoord: { lat: -6.2764, lng: 106.7461 },
    rating: 4.7,
    reviewsCount: 11,
    reputationBadge: 'Streak Master ⚡',
    isVerified: false,
    membership: 'Free'
  },
  {
    id: 'user-6',
    name: 'Citra Kirana',
    avatar: '👩‍🦱',
    age: 25,
    hobbies: ['Jogging Pagi', 'Cafe Hopping'],
    skillLevel: 'Beginner',
    vibe: 'Social',
    availability: {
      'Sabtu': ['Pagi (06:00 - 11:00)', 'Siang (11:00 - 15:00)'],
      'Minggu': ['Pagi (06:00 - 11:00)', 'Siang (11:00 - 15:00)']
    },
    bio: 'Mari jogging manja di GBK lanjut sarapan bubur ayam atau cari kopi susu enak! No pressure, super chill',
    location: 'Senayan, Jakarta Pusat',
    locationCoord: { lat: -6.2217, lng: 106.8033 },
    rating: 4.9,
    reviewsCount: 25,
    reputationBadge: 'Community Pillar ❤️',
    isVerified: true,
    membership: 'Premium'
  },
  {
    id: 'user-7',
    name: 'Randi Hartono',
    avatar: '👱',
    age: 24,
    hobbies: ['Board Games', 'Billiard'],
    skillLevel: 'Pro',
    vibe: 'Competitive',
    availability: {
      'Senin': ['Malam (19:00 - 22:00)'],
      'Rabu': ['Malam (19:00 - 22:00)'],
      'Sabtu': ['Sore (15:00 - 18:00)', 'Malam (19:00 - 22:00)']
    },
    bio: 'Mari adu skill billiard di daerah Kuningan. Nyari group kecil biar ga usah nunggu antrean meja terlalu lama',
    location: 'Kuningan, Jakarta Selatan',
    locationCoord: { lat: -6.2215, lng: 106.8251 },
    rating: 4.6,
    reviewsCount: 16,
    reputationBadge: 'Fair Player 🤝',
    isVerified: true,
    membership: 'Free'
  }
];

export const MOCK_ACHIEVEMENT_LIST: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Wajah Terpercaya',
    description: 'Selesaikan verifikasi profil menggunakan foto asli untuk status Terverifikasi.',
    icon: '👤',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    badgeName: 'Verified'
  },
  {
    id: 'ach-2',
    title: 'Spontan Berkeringat',
    description: 'Hadir dalam 3 aktivitas micro-group olahraga tanpa membatalkan jadwal.',
    icon: '🔥',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    badgeName: 'Reliable Player'
  },
  {
    id: 'ach-3',
    title: 'Circle Hangat',
    description: 'Beri feedback positif / rating bintang 5 ke 5 teman mabar setelah meetup.',
    icon: '🤝',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    badgeName: 'Community Champion'
  },
  {
    id: 'ach-4',
    title: 'Pembawa Damai',
    description: 'Kirim pesan ramah di 5 lobi aktivitas yang berbeda tanpa terdeteksi kata kasar.',
    icon: '🕊️',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    badgeName: 'Good Vibe Vouch'
  }
];

export const SYSTEM_BOT_ANSWERS = [
  "Wah boleh banget! Kapan enaknya ya?",
  "Halo semuanya, salam kenal! Aku pas banget bisa di slot itu.",
  "Ikut dong! Kebetulan ini hobi favorit aku banget.",
  "Aman guys, aku bisa menyesuaikan lokasi.",
  "Keren! Semoga rekomendasinya cocok buat kita ya.",
  "Aku setuju dengan lobi ini, seru bgt nih kelihatannya."
];
