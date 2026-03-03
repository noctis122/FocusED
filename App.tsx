import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import { GamifiedPreview } from './components/sections/GamifiedPreview';
import { DualMode } from './components/sections/DualMode';
import { Closing } from './components/sections/Closing';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { AuthScreen } from './components/auth/AuthScreen';
import { ModeSelection } from './components/onboarding/ModeSelection';
import { ProfileSetup } from './components/onboarding/ProfileSetup';
import { AILoading } from './components/onboarding/AILoading';
import { DashboardPlaceholder } from './components/dashboard/DashboardPlaceholder';
import { CalendarView } from './components/calendar/CalendarView';
import { FocusMode } from './components/focus/FocusMode';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ExamPrep } from './components/student/ExamPrep';
import { DemoNavigator } from './components/demo/DemoNavigator';
import { FeaturesPage, StudentPage, InstitutionPage, RewardsPage } from './components/Pages';
import { ViewState, UserProfile, Quest } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { DemoProvider, useDemoContext } from './context/DemoContext';
import { CourseHub } from './components/course-hub/CourseHub';
import { LearningLibrary } from './components/library/LearningLibrary';

// Main App Content wrapped to use context
const AppContent: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  
  const { user, setUser, setSelectedCourseId } = useDemoContext();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const startJourney = () => setView('AUTH');
  
  const startStudentDemo = () => {
    setUser({
      name: 'Demo Student',
      email: 'student@demo.com',
      level: 'University',
      avatarId: 'bot',
      mode: 'SOLO',
      personality: 'Explorer',
      goals: ['Ace Exams'],
      energyLevel: 'Moderate',
      theme: 'Neon Night',
      soundPack: 'Cyber Gaming',
      consistencyLevel: 85
    });
    setView('DASHBOARD');
  };

  const startTeacherDemo = () => setView('TEACHER_DASHBOARD');

  const handleAuthComplete = (data: Partial<UserProfile>) => {
    setUser({ ...user, ...data } as UserProfile);
    setView('MODE_SELECTION');
  };

  const handleModeSelect = (mode: 'SOLO' | 'CLASS') => {
    setUser({ ...user, mode } as UserProfile);
    setView('PROFILE_SETUP');
  };

  const handleProfileComplete = (data: Partial<UserProfile>) => {
    setUser({ ...user, ...data } as UserProfile);
    setView('AI_LOADING');
  };

  const handleStartSession = (quest: Quest) => {
    setActiveQuest(quest);
    setView('FOCUS_MODE');
  };

  const handleOpenHub = (courseId: string) => {
    setSelectedCourseId(courseId);
    setView('COURSE_HUB');
  };

  // Determine if Navbar should be visible
  const showNavbar = [
    'LANDING', 
    'DASHBOARD', 
    'CALENDAR',
    'TEACHER_DASHBOARD', 
    'STUDENT_EXAM',
    'PAGE_FEATURES',
    'PAGE_STUDENT',
    'PAGE_INSTITUTION',
    'PAGE_REWARDS',
    'LEARNING_LIBRARY'
  ].includes(view);

  return (
    <main className="bg-background text-white min-h-screen selection:bg-primary selection:text-black font-sans relative">
      <ParticleBackground />
      
      {showNavbar && (
        <Navbar 
          onLogin={startJourney} 
          onTeacherDemo={startTeacherDemo}
          onNavigate={setView}
        />
      )}

      {view !== 'LANDING' && !view.startsWith('PAGE_') && (
        <DemoNavigator currentView={view} onChangeView={setView} />
      )}

      <AnimatePresence mode='wait'>
        {view === 'LANDING' && (
          <motion.div
            key="landing"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <Hero onStudentDemo={startStudentDemo} onTeacherDemo={startTeacherDemo} />
            <Features />
            <GamifiedPreview />
            <DualMode />
            <Closing />
          </motion.div>
        )}

        {view === 'PAGE_FEATURES' && <FeaturesPage key="p_features" />}
        {view === 'PAGE_STUDENT' && <StudentPage key="p_student" />}
        {view === 'PAGE_INSTITUTION' && <InstitutionPage key="p_inst" />}
        {view === 'PAGE_REWARDS' && <RewardsPage key="p_rewards" />}

        {view === 'AUTH' && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AuthScreen onComplete={handleAuthComplete} />
          </motion.div>
        )}

        {view === 'MODE_SELECTION' && (
          <motion.div key="mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModeSelection onSelect={handleModeSelect} />
          </motion.div>
        )}

        {view === 'PROFILE_SETUP' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfileSetup onComplete={handleProfileComplete} />
          </motion.div>
        )}

        {view === 'AI_LOADING' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AILoading onComplete={() => setView('DASHBOARD')} />
          </motion.div>
        )}

        {view === 'DASHBOARD' && (
          <div key="dashboard" className="animate-in fade-in duration-500">
            <DashboardPlaceholder 
              onStartSession={handleStartSession} 
              onOpenExam={() => setView('STUDENT_EXAM')}
              onOpenHub={handleOpenHub}
            />
          </div>
        )}

        {view === 'CALENDAR' && (
          <div key="calendar" className="animate-in fade-in duration-500">
            <CalendarView onNavigate={setView} />
          </div>
        )}

        {view === 'LEARNING_LIBRARY' && (
          <div key="library" className="animate-in fade-in duration-500">
            <LearningLibrary onNavigate={setView} />
          </div>
        )}

        {view === 'FOCUS_MODE' && activeQuest && (
          <div key="focus" className="animate-in fade-in duration-500">
            <FocusMode 
              quest={activeQuest} 
              onExit={() => setView('DASHBOARD')}
              onComplete={() => setView('DASHBOARD')}
            />
          </div>
        )}

        {view === 'COURSE_HUB' && (
          <div key="course_hub" className="animate-in fade-in zoom-in duration-300">
             <CourseHub onBack={() => setView('DASHBOARD')} onNavigate={setView} />
          </div>
        )}

        {view === 'TEACHER_DASHBOARD' && (
          <div key="teacher" className="animate-in fade-in duration-500">
            <TeacherDashboard />
          </div>
        )}

        {view === 'STUDENT_EXAM' && (
           <div key="exam" className="animate-in fade-in duration-500">
             <ExamPrep onBack={() => setView('DASHBOARD')} />
           </div>
        )}
      </AnimatePresence>
    </main>
  );
};

const App: React.FC = () => {
  return (
    <DemoProvider>
      <AppContent />
    </DemoProvider>
  );
};

export default App;