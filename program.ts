export interface Program {
  id: string;
  title: string;
  country: string;
  institution: string;
  field: ProgramField;
  description: string;
  format: 'online' | 'offline' | 'hybrid';
  residence: 'on-campus' | 'off-campus' | 'homestay' | 'not-provided';
  ageRange: { min: number; max: number };
  applicationDeadline: Date;
  programStart: Date;
  duration: string;
  applicationCost: number;
  hasLowIncomeDiscount: boolean;
  internationalAcceptanceRate: number;
  requirements: string[];
  benefits: string[];
  applicationStatus?: 'not-started' | 'in-progress' | 'submitted' | 'saved';
}

export type ProgramField = 
  | 'bioengineering'
  | 'computer-science'
  | 'business'
  | 'arts'
  | 'medicine'
  | 'engineering'
  | 'social-sciences'
  | 'natural-sciences'
  | 'humanities';

export interface ProgramFieldTheme {
  color: string;
  bgColor: string;
  lightBg: string;
  gradient: string;
}

export const fieldThemes: Record<ProgramField, ProgramFieldTheme> = {
  bioengineering: {
    color: '#16a34a',
    bgColor: '#dcfce7',
    lightBg: '#f0fdf4',
    gradient: 'from-green-50 to-emerald-50',
  },
  'computer-science': {
    color: '#2563eb',
    bgColor: '#dbeafe',
    lightBg: '#eff6ff',
    gradient: 'from-blue-50 to-indigo-50',
  },
  business: {
    color: '#ea580c',
    bgColor: '#fed7aa',
    lightBg: '#fff7ed',
    gradient: 'from-orange-50 to-amber-50',
  },
  arts: {
    color: '#9333ea',
    bgColor: '#e9d5ff',
    lightBg: '#faf5ff',
    gradient: 'from-purple-50 to-fuchsia-50',
  },
  medicine: {
    color: '#dc2626',
    bgColor: '#fecaca',
    lightBg: '#fef2f2',
    gradient: 'from-red-50 to-rose-50',
  },
  engineering: {
    color: '#0891b2',
    bgColor: '#cffafe',
    lightBg: '#ecfeff',
    gradient: 'from-cyan-50 to-sky-50',
  },
  'social-sciences': {
    color: '#ca8a04',
    bgColor: '#fef3c7',
    lightBg: '#fefce8',
    gradient: 'from-yellow-50 to-amber-50',
  },
  'natural-sciences': {
    color: '#059669',
    bgColor: '#d1fae5',
    lightBg: '#f0fdfa',
    gradient: 'from-teal-50 to-emerald-50',
  },
  humanities: {
    color: '#7c3aed',
    bgColor: '#ddd6fe',
    lightBg: '#f5f3ff',
    gradient: 'from-violet-50 to-purple-50',
  },
};

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'deadline' | 'announcement' | 'essay-tip';
  programId?: string;
}

export interface EssayFeedback {
  text: string;
  suggestions: Array<{
    id: string;
    position: { start: number; end: number };
    type: 'grammar' | 'clarity' | 'structure' | 'impact' | 'tone';
    message: string;
    suggestion: string;
  }>;
  overallScore: number;
  strengths: string[];
  improvements: string[];
}