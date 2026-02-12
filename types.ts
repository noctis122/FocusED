import React from 'react';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export enum UserMode {
  STUDENT = 'STUDENT',
  INSTITUTION = 'INSTITUTION'
}

export type ViewState = 
  | 'LANDING' 
  | 'AUTH' 
  | 'MODE_SELECTION' 
  | 'PROFILE_SETUP' 
  | 'AI_LOADING' 
  | 'DASHBOARD' 
  | 'CALENDAR'
  | 'FOCUS_MODE' 
  | 'TEACHER_DASHBOARD' 
  | 'STUDENT_EXAM'
  | 'COURSE_HUB'
  | 'LEARNING_LIBRARY'
  | 'PAGE_FEATURES'
  | 'PAGE_STUDENT'
  | 'PAGE_INSTITUTION'
  | 'PAGE_REWARDS';

export interface UserProfile {
  name: string;
  email: string;
  level: 'High School' | 'University' | 'Self Learning';
  avatarId: string;
  mode: 'SOLO' | 'CLASS' | null;
  personality: string;
  goals: string[];
  energyLevel: 'Light' | 'Moderate' | 'Intensive';
  theme: string;
  soundPack: string;
}

// Behavioral Intelligence Types
export type StudentState = 'OPTIMAL' | 'RECOVERY' | 'STRAINED';
export type WorkloadLevel = 'BALANCED' | 'RISING' | 'OVERLOAD';
export type BurnoutRisk = 'LOW' | 'MODERATE' | 'HIGH';

// Dashboard Specific Types

export interface Course {
  id: string;
  name: string;
  color: string;
  icon?: React.ReactNode;
  type: 'INSTITUTIONAL' | 'PERSONAL';
  instructor?: string;
  progress: number; // 0-100
  nextLecture?: string;
  examDate?: Date;
  description?: string;
}

export type QuestType = 'SESSION' | 'QUIZ' | 'FLASHCARD' | 'CONCEPT' | 'TEACHER' | 'AI_REVISION' | 'PERSONAL' | 'BRAIN_KICK' | 'PROJECT' | 'EXAM_PREP' | 'FITNESS' | 'RECOVERY';

export interface SubQuest {
  id: string;
  title: string;
  duration: number; // minutes
  type: 'READING' | 'PRACTICE' | 'REVIEW' | 'MOCK_EXAM' | 'WORKOUT' | 'MEDITATION';
  status: 'LOCKED' | 'AVAILABLE' | 'COMPLETED';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  scheduledDate?: Date; // Link to calendar
}

export interface Quest {
  id: string;
  title: string;
  courseId: string | 'PERSONAL' | 'SYSTEM';
  type: QuestType;
  duration: number; // minutes (total if parent)
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  status: 'LOCKED' | 'AVAILABLE' | 'ACTIVE' | 'COMPLETED';
  aiConfidence: number; // 0-100
  description?: string;
  subQuests?: SubQuest[]; // New hierarchical structure
  subtasks?: string[]; // Deprecated, keeping for backward compat if needed, prefer subQuests
  xpReward: number;
}

export interface Reward {
  id: string;
  name: string;
  type: 'SKIN' | 'BADGE' | 'THEME';
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY';
  unlocked: boolean;
  position: number; // 0-360 degrees for placement
}

// Calendar Types
export type EventType = 'EXAM' | 'CLASS' | 'STUDY' | 'QUEST' | 'PERSONAL' | 'FITNESS';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  courseId?: string;
  description?: string;
  completed: boolean;
  aiSuggested?: boolean;
  location?: string;
  questId?: string; // Link to parent Quest
  subQuestId?: string; // Link to specific SubQuest
}

// Focus Mode Types

export type SessionPhase = 'WARMUP' | 'FOCUS' | 'BREAK' | 'SUMMARY' | 'RITUAL_CLOSING';

export interface Subtask {
  id: string;
  title: string;
  type: 'READING' | 'FLASHCARDS' | 'QUIZ' | 'WORKOUT';
  completed: boolean;
  content: any; // Flexible for prototype
}

export interface ActiveSession {
  questId: string;
  elapsed: number;
  tasks: Subtask[];
  currentTaskIndex: number;
  phase: SessionPhase;
  isPaused: boolean;
}

// Teacher Types

export interface ClassGroup {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  activeQuests: number;
  engagementScore: number; // 0-100
  color: string;
  nextDeadline?: string;
  description?: string;
}

export interface TeacherQuestModule {
  id: string;
  type: 'VIDEO' | 'READING' | 'QUIZ' | 'FLASHCARDS' | 'CHECKPOINT';
  title: string;
  duration: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface TeacherBuilderState {
  isGenerating: boolean;
  showAIPreview: boolean;
}

export interface StudentMetric {
  id: string;
  name: string;
  engagement: number;
  completedQuests: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Course Hub Types
export interface CourseMaterial {
  id: string;
  title: string;
  type: 'VIDEO' | 'READING' | 'SLIDES' | 'QUIZ';
  duration: number; // minutes
  completed: boolean;
  content?: any; // Text content or slides array
}

export interface CourseChapter {
  id: string;
  title: string;
  materials: CourseMaterial[];
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  type?: 'TEXT' | 'GRAPH' | 'FLASHCARDS' | 'ACTION';
  data?: any; // For graphs or flashcards payloads
  timestamp: Date;
}
