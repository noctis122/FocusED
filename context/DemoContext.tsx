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
  { 
    id: 'q0', 
    title: 'Brain Kick', 
    courseId: 'SYSTEM', 
    type: 'BRAIN_KICK', 
    duration: 2, 
    difficulty: 'EASY', 
    intensity: 'LIGHT',
    deadlineUrgency: 'LOW',
    status: 'AVAILABLE', 
    aiConfidence: 99, 
    description: 'Activate your cognitive systems. 2 mins.',
    emotionalSupportMessage: "Let's warm up the engine.",
    subQuests: [
      { id: 'bk1', title: 'Breathing Sync', duration: 1, type: 'MEDITATION', status: 'AVAILABLE', difficulty: 'EASY', microObjective: 'Center focus' },
      { id: 'bk2', title: 'Recall Challenge', duration: 1, type: 'PRACTICE', status: 'LOCKED', difficulty: 'EASY', microObjective: 'Prime memory' }
    ]
  },
  { 
    id: 'q1', 
    title: 'Study Schrödinger Equation', 
    courseId: 'c1', 
    type: 'SESSION', 
    duration: 22, 
    difficulty: 'MEDIUM',
    intensity: 'MEDIUM',
    deadlineUrgency: 'HIGH',
    status: 'AVAILABLE', 
    aiConfidence: 95, 
    description: 'Master the wave function through decomposed steps.', 
    emotionalSupportMessage: "This topic looked dense, so I've broken it into 4 safe steps.",
    aiRationale: "High complexity topic + approaching midterm. I've prioritized concept mapping over heavy derivation.",
    subQuests: [
      { id: 'sq1', title: 'Concept Flashcards', duration: 5, type: 'READING', status: 'AVAILABLE', difficulty: 'EASY', microObjective: 'Learn symbols (Ψ, Ĥ, E)' },
      { id: 'sq2', title: 'Graph Interpretation', duration: 7, type: 'PRACTICE', status: 'LOCKED', difficulty: 'MEDIUM', microObjective: 'Visualize probability density' },
      { id: 'sq3', title: 'Mini Quiz Reinforcement', duration: 5, type: 'PRACTICE', status: 'LOCKED', difficulty: 'MEDIUM', microObjective: 'Verify understanding' },
      { id: 'sq4', title: 'Focus Session Practice', duration: 5, type: 'REVIEW', status: 'LOCKED', difficulty: 'MEDIUM', microObjective: 'Apply to simple problem' }
    ] 
  },
  { 
    id: 'q2', 
    title: 'Data Structures Homework', 
    courseId: 'c1', 
    type: 'PROJECT', 
    duration: 35, 
    difficulty: 'HARD',
    intensity: 'DEEP',
    deadlineUrgency: 'MODERATE',
    status: 'AVAILABLE', 
    aiConfidence: 88, 
    description: 'Implementation of Binary Search Tree.', 
    emotionalSupportMessage: "Coding assignments can be stressful. Let's plan it first.",
    aiRationale: "Project requires logical flow. Breaking into planning vs coding reduces cognitive load.",
    subQuests: [
      { id: 'ds1', title: 'Problem Comprehension', duration: 5, type: 'READING', status: 'AVAILABLE', difficulty: 'EASY', microObjective: 'Identify edge cases' },
      { id: 'ds2', title: 'Algorithm Planning', duration: 10, type: 'PRACTICE', status: 'LOCKED', difficulty: 'MEDIUM', microObjective: 'Draft pseudo-code' },
      { id: 'ds3', title: 'Implementation', duration: 15, type: 'PRACTICE', status: 'LOCKED', difficulty: 'HARD', microObjective: 'Write core logic' },
      { id: 'ds4', title: 'Debug Review', duration: 5, type: 'REVIEW', status: 'LOCKED', difficulty: 'MEDIUM', microObjective: 'Verify test cases' }
    ]
  },
  { 
    id: 'q_gym', 
    title: 'Evening Workout', 
    courseId: 'PERSONAL', 
    type: 'FITNESS', 
    duration: 45, 
    difficulty: 'MEDIUM',
    intensity: 'MEDIUM',
    deadlineUrgency: 'LOW',
    status: 'AVAILABLE', 
    aiConfidence: 100, 
    description: 'Strength maintenance to support cognitive function.',
    emotionalSupportMessage: "Movement fuels the mind. Just a quick session.",
    aiRationale: "Sedentary day detected. Physical activation will boost focus for tomorrow.",
    subQuests: [
      { id: 'gym1', title: 'Dynamic Warm-up', duration: 5, type: 'WORKOUT', status: 'AVAILABLE', difficulty: 'EASY', microObjective: 'Joint mobility' },
      { id: 'gym2', title: 'Training Routine', duration: 30, type: 'WORKOUT', status: 'LOCKED', difficulty: 'MEDIUM', microObjective: 'Hypertrophy focus' },
      { id: 'gym3', title: 'Recovery Stretch', duration: 10, type: 'MEDITATION', status: 'LOCKED', difficulty: 'EASY', microObjective: 'Parasympathetic reset' }
    ]
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
  
  // New: Daily Capacity
  dailyCapacity: number; // 0-100 percentage
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
  const [dailyCapacity, setDailyCapacity] = useState(65); // Initial usage %

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
        // Increase capacity usage (inverted logic: completing clears capacity for next day, but for demo we show usage)
        // Let's pretend completing reduces the load? Or adds to "Used" capacity.
        // Actually, "Capacity Usage" implies how much of your daily tank is full.
        setDailyCapacity(prev => Math.min(prev + 10, 100));

        if (id === 'q0') { // Brain kick unlocks first set
           return updated.map(q => (q.id === 'q1' || q.id === 'q3' || q.id === 'q2') ? { ...q, status: 'AVAILABLE' } : q);
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
        // This function might be less used now that initial quests are pre-populated, 
        // but useful for dynamic generation from other parts of the app.
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
    
    const quest = quests.find(q => q.id === questId);
    let sessionTasks: Subtask[] = [];

    // Dynamically map subquests to session tasks if available
    if (quest?.subQuests && quest.subQuests.length > 0) {
      sessionTasks = quest.subQuests.map((sq, index) => ({
        id: sq.id,
        title: sq.title,
        type: sq.type === 'READING' ? 'READING' : sq.type === 'WORKOUT' ? 'WORKOUT' : sq.type === 'PRACTICE' ? 'QUIZ' : 'FLASHCARDS', // Simple mapping
        completed: sq.status === 'COMPLETED',
        content: quest.type === 'FITNESS' 
          ? { exercise: sq.title, sets: 3, reps: 10, rest: 60 } // Mock fitness content
          : MOCK_SUBTASKS[index % MOCK_SUBTASKS.length].content // Recycle mock academic content for now
      }));
    } else {
      // Fallback for non-decomposed quests
      sessionTasks = quest?.type === 'FITNESS' ? JSON.parse(JSON.stringify(GYM_SUBTASKS)) : JSON.parse(JSON.stringify(MOCK_SUBTASKS));
    }

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
    setDailyCapacity(95);
  };

  const acceptRecoveryPlan = () => {
    // 1. Reset Risk indicators
    setStudentState('OPTIMAL');
    setBurnoutRisk('LOW');
    setWorkloadLevel('BALANCED');
    setDailyCapacity(40); // Reset capacity usage to something manageable

    // 2. Clear old dashboard quests (simulated by filtering for demo)
    
    const recoveryQuests: Quest[] = [
      {
        id: `rec_kick_${Date.now()}`,
        title: 'Brain Kick: Breathing',
        courseId: 'SYSTEM',
        type: 'BRAIN_KICK',
        duration: 5,
        difficulty: 'EASY',
        intensity: 'LIGHT',
        deadlineUrgency: 'LOW',
        status: 'AVAILABLE',
        aiConfidence: 100,
        description: 'Start slow. Just 5 minutes of focus breathing to reset.',
        emotionalSupportMessage: "Resetting your baseline.",
        subQuests: [{ id: 'rk1', title: 'Box Breathing', duration: 5, type: 'MEDITATION', status: 'AVAILABLE', difficulty: 'EASY', microObjective: 'Calm nervous system' }]
      },
      {
        id: `rec_main_${Date.now()}`,
        title: 'Quantum Concepts Review',
        courseId: 'c1',
        type: 'AI_REVISION',
        duration: 20,
        difficulty: 'MEDIUM',
        intensity: 'MEDIUM',
        deadlineUrgency: 'LOW',
        status: 'LOCKED', // Unlocks after Brain Kick in real logic, but available for demo flow
        aiConfidence: 90,
        description: 'Condensed review of Schrödinger Equation. No heavy math today.',
        subQuests: [
          { id: 'rm1', title: 'Video Summary', duration: 10, type: 'READING', status: 'AVAILABLE', difficulty: 'EASY', microObjective: 'Passive review' },
          { id: 'rm2', title: 'Key Terms Match', duration: 10, type: 'PRACTICE', status: 'LOCKED', difficulty: 'MEDIUM', microObjective: 'Light recall' }
        ]
      }
    ];

    setQuests(recoveryQuests);
  };

  const triggerExamPressure = () => {
    setWorkloadLevel('RISING');
    setBurnoutRisk('MODERATE');
    setDailyCapacity(80);
    // Maybe reorder quests or add exam prep visual
  };

  const resetBehavioralState = () => {
    setStudentState('OPTIMAL');
    setWorkloadLevel('BALANCED');
    setBurnoutRisk('LOW');
    setDailyCapacity(65);
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
      triggerRecoveryMode, acceptRecoveryPlan, triggerExamPressure, resetBehavioralState,
      dailyCapacity
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
