import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile, Quest, Reward, ClassGroup, StudentMetric, TeacherQuestModule, Course, Subtask, SessionPhase, CalendarEvent, ActiveSession, TeacherBuilderState, SubQuest, CourseChapter, StudentState, WorkloadLevel, BurnoutRisk } from '../types';

// Calendar Helper to generate dates relative to today
const getRelativeDate = (days: number, hours: number = 9) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hours, 0, 0, 0);
  return d;
};

// --- SHARED MOCK DATA ---

export const INITIAL_COURSES: Course[] = [
  { 
    id: 'c1', 
    name: 'Quantum Mechanics I', 
    color: '#00f2ea', 
    type: 'INSTITUTIONAL', 
    instructor: 'Dr. Lina Ben Salem',
    progress: 45,
    nextLecture: 'The Hamiltonian',
    examDate: getRelativeDate(14, 9),
    description: 'Foundations of quantum theory, wave mechanics, and particle physics.'
  },
  { 
    id: 'c2', 
    name: 'Adv. Calculus', 
    color: '#ff0055', 
    type: 'INSTITUTIONAL', 
    instructor: 'Prof. Alan Turing',
    progress: 72,
    nextLecture: 'Multivariable Integration',
    examDate: getRelativeDate(21, 14),
    description: 'Deep dive into differentiation, integration, and vector fields.'
  },
  { 
    id: 'c3', 
    name: 'History of Art', 
    color: '#f0db4f', 
    type: 'INSTITUTIONAL', 
    instructor: 'Dr. Elena Fisher',
    progress: 30,
    nextLecture: 'Renaissance Masterpieces',
    examDate: getRelativeDate(28, 10),
    description: 'From classicism to modernism: a visual journey through time.'
  },
  {
    id: 'p1',
    name: 'React Performance',
    color: '#61dafb',
    type: 'PERSONAL',
    progress: 15,
    description: 'Mastering memoization, rendering cycles, and concurrent mode.',
    nextLecture: 'UseMemo vs UseCallback'
  },
  {
    id: 'p2',
    name: 'Time Management',
    color: '#7000ff',
    type: 'PERSONAL',
    progress: 88,
    description: 'Productivity systems for high-performance students.',
    nextLecture: 'The Pomodoro Technique'
  }
];

// --- COURSE HUB MOCK CONTENT ---
const INITIAL_COURSE_CONTENT: Record<string, CourseChapter[]> = {
  'c1': [
    {
      id: 'ch1',
      title: 'Week 3: Foundations of Wave Mechanics',
      materials: [
        { 
          id: 'm1', 
          title: 'Intro to Schrödinger Equation', 
          type: 'READING', 
          duration: 80, 
          completed: false, 
          content: 'FULL_LECTURE_MOCK' // Special flag to render rich component
        },
        { id: 'm2', title: 'The Photoelectric Effect', type: 'VIDEO', duration: 45, completed: true },
        { id: 'm3', title: 'Wave-Particle Duality', type: 'SLIDES', duration: 30, completed: true }
      ]
    },
    {
      id: 'ch2',
      title: 'Week 4: Quantum Operators',
      materials: [
        { id: 'm4', title: 'The Hamiltonian', type: 'READING', duration: 60, completed: false },
        { id: 'm5', title: 'Operators Practice', type: 'QUIZ', duration: 25, completed: false }
      ]
    }
  ],
  'c2': [
    {
      id: 'ch1',
      title: 'Differentiation Rules',
      materials: [
        { id: 'm1', title: 'Chain Rule Mastery', type: 'READING', duration: 20, completed: true },
        { id: 'm2', title: 'Implicit Differentiation', type: 'VIDEO', duration: 30, completed: false }
      ]
    }
  ]
};

const INITIAL_QUESTS: Quest[] = [
  { id: 'q0', title: 'Brain Kick', courseId: 'SYSTEM', type: 'BRAIN_KICK', duration: 1, difficulty: 'EASY', status: 'AVAILABLE', aiConfidence: 99, xpReward: 50, description: 'Activate your cognitive systems.' },
  { 
    id: 'q1', 
    title: 'Kinematics Review', 
    courseId: 'c1', 
    type: 'SESSION', 
    duration: 25, 
    difficulty: 'MEDIUM', 
    status: 'LOCKED', 
    aiConfidence: 95, 
    xpReward: 150, 
    description: 'Review velocity and acceleration vectors.', 
    subQuests: [
      { id: 'sq1', title: 'Vector Analysis', duration: 10, type: 'READING', status: 'AVAILABLE', difficulty: 'MEDIUM' },
      { id: 'sq2', title: 'Practice Set A', duration: 15, type: 'PRACTICE', status: 'LOCKED', difficulty: 'HARD' }
    ] 
  },
  { id: 'q2', title: 'Derivatives Quiz', courseId: 'c2', type: 'QUIZ', duration: 15, difficulty: 'HARD', status: 'LOCKED', aiConfidence: 88, xpReward: 200, description: 'Quick fire quiz on chain rule.' },
  { id: 'q3', title: 'Renaissance Flashcards', courseId: 'c3', type: 'FLASHCARD', duration: 10, difficulty: 'EASY', status: 'LOCKED', aiConfidence: 92, xpReward: 100 },
  { id: 'q4', title: 'Lab Report Prep', courseId: 'c1', type: 'TEACHER', duration: 45, difficulty: 'HARD', status: 'LOCKED', aiConfidence: 100, xpReward: 300, description: 'Teacher Assigned: Prepare data tables.' },
  { id: 'p1', title: 'Read Sci-Fi Novel', courseId: 'PERSONAL', type: 'PERSONAL', duration: 30, difficulty: 'EASY', status: 'LOCKED', aiConfidence: 100, xpReward: 50 },
  { 
    id: 'q_gym', 
    title: 'Upper Body Power', 
    courseId: 'PERSONAL', 
    type: 'FITNESS', 
    duration: 60, 
    difficulty: 'MEDIUM', 
    status: 'AVAILABLE', 
    aiConfidence: 100, 
    xpReward: 200,
    description: 'Strength training session optimized for evening energy levels.'
  },
  
  // NEW DEMO QUEST: Large task ready for decomposition
  { 
    id: 'demo_big', 
    title: 'Final Project: AI Ethics', 
    courseId: 'c1', 
    type: 'PROJECT', 
    duration: 0, 
    difficulty: 'HARD', 
    status: 'AVAILABLE', 
    aiConfidence: 75, 
    xpReward: 500, 
    description: 'Prepare final presentation on ethical implications of AGI. (AI Decomposition Available)'
  }
];

const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', name: 'Neon Compass Skin', type: 'SKIN', rarity: 'RARE', unlocked: false, position: 45 },
  { id: 'r2', name: 'Void Badge', type: 'BADGE', rarity: 'LEGENDARY', unlocked: true, position: 180 },
  { id: 'r3', name: 'Early Bird', type: 'BADGE', rarity: 'COMMON', unlocked: true, position: 270 },
];

const MOCK_CLASSES: ClassGroup[] = [
  { id: 'c1', name: 'Intro to Comp Sci', code: 'CS101', studentCount: 142, activeQuests: 3, engagementScore: 88, color: '#00f2ea', nextDeadline: 'Oct 24', description: 'Fundamentals of algorithms and data structures.' },
  { id: 'c2', name: 'Advanced Physics', code: 'PHY304', studentCount: 56, activeQuests: 1, engagementScore: 72, color: '#ff0055', nextDeadline: 'Oct 28', description: 'Quantum mechanics and relativity.' },
  { id: 'c3', name: 'Modern Art History', code: 'ART202', studentCount: 89, activeQuests: 2, engagementScore: 94, color: '#f0db4f', nextDeadline: 'Nov 01', description: 'From Impressionism to Contemporary.' },
];

const MOCK_STUDENTS: StudentMetric[] = [
  { id: 's1', name: 'Alice Chen', engagement: 98, completedQuests: 12, riskLevel: 'LOW' },
  { id: 's2', name: 'Marcus Johnson', engagement: 45, completedQuests: 4, riskLevel: 'HIGH' },
  { id: 's3', name: 'Sarah Miller', engagement: 76, completedQuests: 9, riskLevel: 'MEDIUM' },
  { id: 's4', name: 'David Kim', engagement: 92, completedQuests: 11, riskLevel: 'LOW' },
  { id: 's5', name: 'Elena Rodriguez', engagement: 68, completedQuests: 7, riskLevel: 'MEDIUM' },
];

const INITIAL_TEACHER_MODULES: TeacherQuestModule[] = [
  { id: 'm1', type: 'VIDEO', title: 'Lecture 4: Algorithms', duration: 45, difficulty: 'MEDIUM' },
  { id: 'm2', type: 'READING', title: 'Chapter 3 Reading', duration: 30, difficulty: 'EASY' },
];

const INITIAL_EVENTS: CalendarEvent[] = [
  { 
    id: 'e1', 
    title: 'Quantum Physics Midterm', 
    start: getRelativeDate(5, 10), 
    end: getRelativeDate(5, 12), 
    type: 'EXAM', 
    courseId: 'c1', 
    description: 'Midterm covering Kinematics and Dynamics.', 
    completed: false 
  },
  { 
    id: 'e2', 
    title: 'Adv. Calculus Lecture', 
    start: getRelativeDate(1, 14), 
    end: getRelativeDate(1, 15), 
    type: 'CLASS', 
    courseId: 'c2', 
    location: 'Hall B - Online Stream', 
    completed: true 
  },
  { 
    id: 'e3', 
    title: 'Art History Essay Due', 
    start: getRelativeDate(3, 23), 
    end: getRelativeDate(3, 23), 
    type: 'QUEST', 
    courseId: 'c3', 
    description: 'Submit essay on Renaissance influence.', 
    completed: false 
  },
  { 
    id: 'e4', 
    title: 'Focus Block: Derivatives', 
    start: getRelativeDate(2, 18), 
    end: getRelativeDate(2, 19), 
    type: 'STUDY', 
    courseId: 'c2', 
    description: 'Deep work session on derivatives.', 
    completed: false,
    aiSuggested: true 
  },
  { 
    id: 'e5', 
    title: 'Gym / Recovery', 
    start: getRelativeDate(0, 17), 
    end: getRelativeDate(0, 18), 
    type: 'PERSONAL', 
    description: 'Physical recovery for cognitive maintenance.', 
    completed: false 
  },
  { 
    id: 'e6', 
    title: 'Physics Lab Prep', 
    start: getRelativeDate(6, 9), 
    end: getRelativeDate(6, 11), 
    type: 'STUDY', 
    courseId: 'c1', 
    description: 'Prepare lab notes for next week.', 
    completed: false,
    aiSuggested: true
  },
  {
    id: 'e7',
    title: 'Gym Session',
    start: new Date(new Date().setHours(18, 0, 0, 0)), // Today 18:00
    end: new Date(new Date().setHours(19, 0, 0, 0)),
    type: 'FITNESS',
    description: 'Upper body strength training.',
    completed: false,
    questId: 'q_gym'
  }
];

// --- FOCUS MODE MOCK DATA ---
export const MOCK_SUBTASKS: Subtask[] = [
  {
    id: 't1',
    title: 'Concept Overview',
    type: 'READING',
    completed: false,
    content: {
      heading: 'Kinematics: Velocity vs Acceleration',
      text: 'Velocity is a vector quantity that refers to "the rate at which an object changes its position." Imagine a person moving rapidly - one step forward and one step back. They may return to their starting position, but they had a high velocity during the movement.\n\nAcceleration is a vector quantity that is defined as the rate at which an object changes its velocity. An object is accelerating if it is changing its velocity.'
    }
  },
  {
    id: 't2',
    title: 'Key Terms Recall',
    type: 'FLASHCARDS',
    completed: false,
    content: [
      { front: 'Scalar Quantity', back: 'A quantity that is fully described by a magnitude (or numerical value) alone.' },
      { front: 'Vector Quantity', back: 'A quantity that is fully described by both a magnitude and a direction.' },
      { front: 'Displacement', back: 'A vector quantity that refers to "how far out of place an object is"; it is the object\'s overall change in position.' }
    ]
  },
  {
    id: 't3',
    title: 'Knowledge Check',
    type: 'QUIZ',
    completed: false,
    content: {
      question: 'If a car moves at a constant speed in a circle, is it accelerating?',
      options: ['No, because speed is constant', 'Yes, because direction is changing', 'No, because velocity is constant'],
      correct: 1
    }
  },
  {
    id: 't4',
    title: 'Visual Analysis',
    type: 'READING', // Using READING type but will render Graph
    completed: false,
    content: {
      heading: 'Velocity-Time Graph Analysis',
      isGraph: true,
      text: 'Analyze the slope of the line. A positive slope indicates positive acceleration. A horizontal line indicates constant velocity (zero acceleration).'
    }
  }
];

export const GYM_SUBTASKS: Subtask[] = [
  {
    id: 'g1',
    title: 'Dynamic Warmup',
    type: 'READING',
    completed: false,
    content: {
      heading: 'Activation Sequence',
      text: 'Prepare your joints and muscles for load. Do not skip this.'
    }
  },
  {
    id: 'g2',
    title: 'Bench Press',
    type: 'WORKOUT',
    completed: false,
    content: {
      exercise: 'Barbell Bench Press',
      sets: 3,
      reps: 10,
      rest: 90
    }
  },
  {
    id: 'g3',
    title: 'Pull Ups',
    type: 'WORKOUT',
    completed: false,
    content: {
      exercise: 'Wide Grip Pull Ups',
      sets: 3,
      reps: 'Failure',
      rest: 90
    }
  }
];

// --- CONTEXT DEFINITION ---

interface DemoContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  
  quests: Quest[];
  updateQuestStatus: (id: string, status: Quest['status']) => void;
  addQuest: (quest: Quest) => void;
  generateAIPlan: (questId: string) => Promise<void>;
  
  rewards: Reward[];
  unlockReward: (id: string) => void;
  
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: CalendarEvent) => void;
  updateCalendarEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  
  teacherClasses: ClassGroup[];
  addClass: (cls: ClassGroup) => void;
  
  teacherModules: TeacherQuestModule[];
  setTeacherModules: (modules: TeacherQuestModule[]) => void;
  teacherBuilderState: TeacherBuilderState;
  setTeacherBuilderState: (state: TeacherBuilderState) => void;
  
  studentMetrics: StudentMetric[];
  
  courses: Course[];
  addCourse: (course: Course) => void;
  
  activeSession: ActiveSession | null;
  startSession: (questId: string) => void;
  updateSession: (updates: Partial<ActiveSession>) => void;
  endSession: () => void;
  
  isDebugOpen: boolean;
  setDebugOpen: (open: boolean) => void;

  // Course Hub
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  getCourseContent: (courseId: string) => CourseChapter[];

  // Behavioral Intelligence
  studentState: StudentState;
  workloadLevel: WorkloadLevel;
  burnoutRisk: BurnoutRisk;
  triggerRecoveryMode: () => void;
  acceptRecoveryPlan: () => void;
  triggerExamPressure: () => void;
  resetBehavioralState: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Global State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [teacherClasses, setTeacherClasses] = useState<ClassGroup[]>(MOCK_CLASSES);
  const [teacherModules, setTeacherModules] = useState<TeacherQuestModule[]>(INITIAL_TEACHER_MODULES);
  const [teacherBuilderState, setTeacherBuilderState] = useState<TeacherBuilderState>({ isGenerating: false, showAIPreview: false });
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [isDebugOpen, setDebugOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [courseContent, setCourseContent] = useState<Record<string, CourseChapter[]>>(INITIAL_COURSE_CONTENT);

  // Behavioral State
  const [studentState, setStudentState] = useState<StudentState>('OPTIMAL');
  const [workloadLevel, setWorkloadLevel] = useState<WorkloadLevel>('BALANCED');
  const [burnoutRisk, setBurnoutRisk] = useState<BurnoutRisk>('LOW');

  // Actions
  const updateQuestStatus = (id: string, status: Quest['status']) => {
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === id) {
            return { ...q, status };
        }
        return q;
      });
      
      // Auto-unlock logic for demo flow
      if (status === 'COMPLETED') {
        if (id === 'q0') { // Brain kick unlocks first set
           return updated.map(q => (q.id === 'q1' || q.id === 'q3') ? { ...q, status: 'AVAILABLE' } : q);
        }
        // General unlock logic: unlock next locked quest
        const nextLocked = updated.find(q => q.status === 'LOCKED' && q.id !== id);
        if (nextLocked) {
           return updated.map(q => q.id === nextLocked.id ? { ...q, status: 'AVAILABLE' } : q);
        }
      }
      return updated;
    });
  };

  // AI Task Decomposition Engine
  const generateAIPlan = async (questId: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const quest = quests.find(q => q.id === questId);
        
        if (quest?.type === 'FITNESS') {
           const subQuests: SubQuest[] = [
             { id: `sq_${Date.now()}_1`, title: 'Warm-Up: Dynamic Stretch', duration: 5, type: 'PRACTICE', status: 'AVAILABLE', difficulty: 'EASY' },
             { id: `sq_${Date.now()}_2`, title: 'Bench Press (3x10)', duration: 15, type: 'WORKOUT', status: 'LOCKED', difficulty: 'HARD' },
             { id: `sq_${Date.now()}_3`, title: 'Pull Ups (3xFailure)', duration: 10, type: 'WORKOUT', status: 'LOCKED', difficulty: 'HARD' },
             { id: `sq_${Date.now()}_4`, title: 'Cool Down & Stretch', duration: 5, type: 'PRACTICE', status: 'LOCKED', difficulty: 'EASY' }
           ];
           setQuests(prev => prev.map(q => q.id === questId ? { ...q, subQuests, duration: 35 } : q));
        } else {
          // Standard Academic breakdown
          const subQuests: SubQuest[] = [
            { id: `sq_${Date.now()}_1`, title: 'Research: Ethical Frameworks', duration: 45, type: 'READING', status: 'AVAILABLE', difficulty: 'MEDIUM', scheduledDate: getRelativeDate(1, 10) },
            { id: `sq_${Date.now()}_2`, title: 'Case Study: Algorithmic Bias', duration: 30, type: 'PRACTICE', status: 'LOCKED', difficulty: 'HARD', scheduledDate: getRelativeDate(2, 14) },
            { id: `sq_${Date.now()}_3`, title: 'Draft Outline Structure', duration: 20, type: 'REVIEW', status: 'LOCKED', difficulty: 'EASY', scheduledDate: getRelativeDate(2, 16) },
            { id: `sq_${Date.now()}_4`, title: 'Final Presentation Mock', duration: 60, type: 'MOCK_EXAM', status: 'LOCKED', difficulty: 'HARD', scheduledDate: getRelativeDate(4, 11) }
          ];
          setQuests(prev => prev.map(q => q.id === questId ? { ...q, subQuests, duration: 155 } : q));
          // Sync to calendar logic here...
        }
        resolve();
      }, 3000); 
    });
  };

  const addQuest = (quest: Quest) => {
    setQuests(prev => [...prev, quest]);
  };

  const addClass = (cls: ClassGroup) => {
    setTeacherClasses(prev => [...prev, cls]);
  };

  const unlockReward = (id: string) => {
    setRewards(prev => prev.map(r => r.id === id ? { ...r, unlocked: true } : r));
  };

  // Calendar Actions
  const addCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, event]);
  };

  const updateCalendarEvent = (id: string, event: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...event } : e));
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  const startSession = (questId: string) => {
    if (activeSession && activeSession.questId === questId) return;
    
    // Check if fitness quest for different session tasks
    const quest = quests.find(q => q.id === questId);
    const sessionTasks = quest?.type === 'FITNESS' ? JSON.parse(JSON.stringify(GYM_SUBTASKS)) : JSON.parse(JSON.stringify(MOCK_SUBTASKS));

    setActiveSession({
      questId,
      elapsed: 0,
      tasks: sessionTasks, 
      currentTaskIndex: 0,
      phase: 'WARMUP',
      isPaused: false
    });
  };

  const updateSession = (updates: Partial<ActiveSession>) => {
    setActiveSession(prev => prev ? { ...prev, ...updates } : null);
  };

  const endSession = () => {
    setActiveSession(null);
  };

  const getCourseContent = (courseId: string) => {
    return courseContent[courseId] || [];
  };

  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
    // Initialize empty or mock content for the new course
    setCourseContent(prev => ({
      ...prev,
      [course.id]: [
        {
          id: `ch_${Date.now()}`,
          title: 'Module 1: AI Generated Fundamentals',
          materials: [
            { id: `m_${Date.now()}_1`, title: 'Core Concepts Overview', type: 'READING', duration: 15, completed: false },
            { id: `m_${Date.now()}_2`, title: 'Key Terminology', type: 'SLIDES', duration: 10, completed: false },
            { id: `m_${Date.now()}_3`, title: 'Practice Quiz', type: 'QUIZ', duration: 20, completed: false }
          ]
        }
      ]
    }));
  };

  // --- BEHAVIORAL SCENARIOS ---

  const triggerRecoveryMode = () => {
    setStudentState('RECOVERY');
    setBurnoutRisk('HIGH');
    setWorkloadLevel('OVERLOAD');
  };

  const acceptRecoveryPlan = () => {
    // 1. Reset Risk indicators
    setStudentState('OPTIMAL');
    setBurnoutRisk('LOW');
    setWorkloadLevel('BALANCED');

    // 2. Clear old dashboard quests (simulated by filtering for demo)
    // In a real app we'd archive them. Here we just replace the list for the demo effect.
    
    const recoveryQuests: Quest[] = [
      {
        id: `rec_kick_${Date.now()}`,
        title: 'Brain Kick: Breathing',
        courseId: 'SYSTEM',
        type: 'BRAIN_KICK',
        duration: 5,
        difficulty: 'EASY',
        status: 'AVAILABLE',
        aiConfidence: 100,
        xpReward: 50,
        description: 'Start slow. Just 5 minutes of focus breathing to reset.'
      },
      {
        id: `rec_main_${Date.now()}`,
        title: 'Quantum Concepts Review',
        courseId: 'c1',
        type: 'AI_REVISION',
        duration: 20,
        difficulty: 'MEDIUM',
        status: 'LOCKED', // Unlocks after Brain Kick in real logic, but available for demo flow
        aiConfidence: 90,
        xpReward: 150,
        description: 'Condensed review of Schrödinger Equation. No heavy math today.'
      },
      {
        id: `rec_light_${Date.now()}`,
        title: 'Code Logic Quiz',
        courseId: 'c1', // Using c1 as placeholder for CS
        type: 'QUIZ',
        duration: 15,
        difficulty: 'MEDIUM',
        status: 'LOCKED',
        aiConfidence: 85,
        xpReward: 100,
        description: 'Low-stakes quiz to keep your streak alive.'
      }
    ];

    setQuests(recoveryQuests);
  };

  const triggerExamPressure = () => {
    setWorkloadLevel('RISING');
    setBurnoutRisk('MODERATE');
    // Maybe reorder quests or add exam prep visual
  };

  const resetBehavioralState = () => {
    setStudentState('OPTIMAL');
    setWorkloadLevel('BALANCED');
    setBurnoutRisk('LOW');
  };

  return (
    <DemoContext.Provider value={{
      user, setUser,
      quests, updateQuestStatus, addQuest, generateAIPlan,
      rewards, unlockReward,
      calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
      teacherClasses, addClass,
      teacherModules, setTeacherModules,
      teacherBuilderState, setTeacherBuilderState,
      studentMetrics: MOCK_STUDENTS,
      courses, addCourse,
      activeSession, startSession, updateSession, endSession,
      isDebugOpen, setDebugOpen,
      selectedCourseId, setSelectedCourseId, getCourseContent,
      studentState, workloadLevel, burnoutRisk,
      triggerRecoveryMode, acceptRecoveryPlan, triggerExamPressure, resetBehavioralState
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemoContext must be used within a DemoProvider");
  return context;
};
