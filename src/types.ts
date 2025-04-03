export type ThemeMode = 'light' | 'dark'

export interface Job {
  id: string | number;
  title: string;
  location?: string;
  listedAt?: string | number;
  url?: string;
  description?: string;
  [key: string]: any;
}

export interface LinkedInProfile {
  id?: string;
  name: string;
  title?: string;
  location?: string;
  profile_url?: string;
  image_url?: string;
  company?: string;
  active_within_90_days?: boolean;
  [key: string]: any;
}

export interface CompanyData {
  url?: string;
  name: string;
  id?: number;
  time?: number;
  error?: string;
  savedAt?: string;
  fromCache?: boolean;
  details?: {
    id: number;
    name: string;
    description?: string;
    [key: string]: any;
  };
  jobs?: Job[];
}

export interface CompanyFormProps {
  onThemeToggle: () => void
} 