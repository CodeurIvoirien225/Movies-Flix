export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
  subscription_status?: 'active' | 'inactive' | 'cancelled';
  subscription_id?: string;
  created_at: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  category: string;
  year: number;
  rating: string;
  duration: string;
  genre: string[];
  featured: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  status: 'active' | 'inactive' | 'cancelled';
  current_period_end: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}