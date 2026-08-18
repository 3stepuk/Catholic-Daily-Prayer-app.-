export type PrayerMoment = 
  | "morning" 
  | "midday" 
  | "evening" 
  | "night" 
  | "lauds" 
  | "vespers" 
  | "compline" 
  | "readings" 
  | "daytime";

export interface JournalEntry {
  id: string;
  timestamp: string;
  category: "Morning Intention" | "Evening Examen" | "Quiet Contemplation" | "Spontaneous Prayer";
  text: string;
  details?: {
    gratitude?: string;
    review?: string;
    sorrow?: string;
    hope?: string;
    intention?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "companion";
  text: string;
  timestamp: string;
}

export interface ScriptureVerse {
  reference: string;
  text: string;
  reflection: string;
}
