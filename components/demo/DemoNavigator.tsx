import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, Compass, Zap, BookOpen, GraduationCap, 
  ChevronRight, X, LayoutGrid, Award, Bug, Calendar, Library, HeartPulse, CloudRain
} from 'lucide-react';
import { ViewState } from '../../types';
import { Button } from '../ui/Button';
import { useDemoContext } from '../../context/DemoContext';

interface DemoNavigatorProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const DemoNavigator: React.FC<DemoNavigatorProps> = ({ currentView, onChangeView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDebugOpen, setDebugOpen, quests, user, setSelectedCourseId, triggerRecoveryMode, triggerExamPressure } = useDemoContext();

  const navItems: { label: string; view: ViewState; icon: any; action?: () => void }[] = [
    { label: 'Landing Page', view: 'LANDING', icon: LayoutGrid },
    { label: 'Student Compass', view: 'DASHBOARD', icon: Compass },
    { label: 'Learning Library', view: 'LEARNING_LIBRARY', icon: Library },
    { label: 'Course Hub (Direct)', view: 'COURSE_HUB', icon: BookOpen, action: () => setSelectedCourseId('c1') },
    { label: 'Calendar', view: 'CALENDAR', icon: Calendar },
    { label: 'Focus Mode', view: 'FOCUS_MODE', icon: Zap },
    { label: 'Exam Engine', view: 'STUDENT_EXAM', icon: BookOpen },
    { label: 'Teacher Dashboard', view: 'TEACHER_DASHBOARD', icon: GraduationCap },
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100] font-sans">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-64 bg-[#0f0c29]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Demo Controls</span>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
              
              <div className="p-2 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => {
                      if (item.action) item.action();
                      onChangeView(item.view);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentView === item.view 
                        ? 'bg-primary/20 text-primary border border-primary/20' 
                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                    {currentView === item.view && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                  </button>
                ))}
              </div>

              <div className="p-3 border-t border-white/10 bg-black/20">
                 <div className="text-[10px] font-bold text-gray-500 uppercase mb-2 px-2">Scenarios</div>
                 <div className="space-y-1">
                    <button 
                      onClick={triggerRecoveryMode}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      <HeartPulse size={16} /> Trigger Recovery
                    </button>
                    <button 
                      onClick={triggerExamPressure}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-yellow-400 hover:bg-yellow-500/10 transition-all"
                    >
                      <CloudRain size={16} /> Trigger Pressure
                    </button>
                 </div>
              </div>

              <div className="p-3 border-t border-white/10 bg-black/20 flex items-center justify-between">
                <span className="text-[10px] text-gray-500">v1.0.3-beta</span>
                <button 
                  onClick={() => setDebugOpen(!isDebugOpen)}
                  className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition-colors ${isDebugOpen ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                >
                  Debug
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className="!p-3 !rounded-full shadow-lg shadow-primary/20"
        >
          <Monitor size={20} className={isOpen ? 'text-primary' : 'text-white'} />
        </Button>
      </div>

      {/* Debug Panel Overlay */}
      <AnimatePresence>
        {isDebugOpen && (
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="fixed top-24 right-6 w-80 bg-black/90 border border-red-500/30 rounded-xl p-4 z-[90] font-mono text-xs text-green-400 shadow-2xl pointer-events-none"
          >
            <div className="font-bold text-red-500 mb-2 border-b border-red-500/30 pb-1">System State Monitor</div>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">View:</span> <span className="text-white">{currentView}</span>
              </div>
              <div>
                <span className="text-gray-500">User:</span> <span className="text-white">{user?.name || 'Guest'} ({user?.mode || 'N/A'})</span>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Quest Status:</div>
                <div className="space-y-1">
                  {quests.map(q => (
                    <div key={q.id} className="flex justify-between">
                      <span className="truncate w-32">{q.title}</span>
                      <span className={q.status === 'COMPLETED' ? 'text-green-500' : q.status === 'LOCKED' ? 'text-red-500' : 'text-yellow-500'}>{q.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
