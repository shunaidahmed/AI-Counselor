export type Language = 'en' | 'ur_roman' | 'ur_script';

export type Career = {
  title: string;
  matchScore?: number;
  emoji: string;
  whyItFits?: string;
  pakistanDemand: string;
  avgSalaryPKR: string;
  topCities?: string[];
  requiredDegree?: string;
  topUniversitiesPak?: string[];
  scholarships?: string;
  roadmap?: string[];
  freelancePotential?: string;
  onlineCourses?: string[];
  category?: string; // For explorer
  overview?: string; // For explorer detail
  dailyLife?: string;
  topEmployers?: string[];
  govtVsPrivate?: string;
  challenges?: string;
  futureOutlook?: string;
};

export type ProfileReport = {
  summary: string;
  topCareers: Career[];
  careerToAvoid: { title: string; reason: string };
  personalityInsight: string;
  motivationalMessage: string;
};

export type UserProfile = {
  name: string;
  age: number | '';
  city: string;
  educationLevel: string;
  subject: string;
  interests: string[];
  otherInterests: string;
  skills: string[];
  favSubject: string;
  leastFavSubject: string;
  dreamProfession: string;
  incomeGoal: number;
  studyAbroad: string;
  relocate: string;
  financialConstraints: string;
  familyPressure: string;
};

export type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};
