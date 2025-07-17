
export interface User {
  id: string;
  email: string;
  username: string;
  accessCode: string;
  isLoggedIn: boolean;
  activeStreams: number;
  maxStreams: number;
  subscriptionStatus: 'free' | 'premium' | 'pro';
  credits: number;
}

export interface Stream {
  id: string;
  userId: string;
  title: string;
  youtubeKey: string;
  quality: '1080p' | '720p' | '480p';
  mode: 'desktop' | 'mobile';
  status: 'offline' | 'starting' | 'live' | 'stopping';
  isLooping: boolean;
  maxDuration?: number; // in hours
  startTime?: Date;
  ping: number;
  viewerCount: number;
  droppedFrames: number;
  uploadSpeed: number; // in Mbps
  fileName?: string;
  overlayText?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, accessCode: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface StreamMetrics {
  ping: number;
  viewerCount: number;
  droppedFrames: number;
  uploadSpeed: number;
  duration: string;
}
