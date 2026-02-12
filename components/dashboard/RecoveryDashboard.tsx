import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, CheckCircle, Brain, ArrowRight, Activity, 
  Shield, Clock, Calendar, RefreshCw, Zap, TrendingUp,
  AlertTriangle, X, Play
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useDemoContext } from '../../context/DemoContext';
import { useSound } from '../../hooks/useSound';

// Mock Data for the Recovery Scenario
const MISSED_TASKS = [
  { id: 'm1', title: 'Schrödinger Eq. Lecture', duration: 60, type: 'ACADEMIC', impact: 'HIGH' },
  { id: 'm2', title: 'Data Structures Lab', duration: 90, type: 'ACADEMIC', impact: 'HIGH' },
  { id: 'm3', title: 'Heavy Lifting Gym', duration: 60, type: 'PERSONAL', impact: 'MEDIUM' }
];

const RECOVERY_PLAN_TASKS = [
  { id: 'r1', title: 'Brain Kick: Breathing', duration: 5, type: 'WELLNESS', description: 'Re-center your focus.' },
  { id: 'r2', title: 'Quantum Concepts Review', duration: 20, type: 'ACADEMIC', description: 'Condensed summary of the lecture.' },
  { id: 'r3', title: 'Code Logic Quiz', duration: 15, type: 'ACADEMIC', description: 'Key concepts from the lab.' },
  { id: 'r4', title: 'Light Stretch', duration: 10, type: 'PERSONAL', description: 'Mobility instead of heavy load.' }
];

export const RecoveryDashboard: React.FC = () => {
  const { acceptRecoveryPlan, resetBehavioralState } = useDemoContext();
  const { playClick, playUnlock, playHover } = useSound();
  
  const [step, setStep] = useState<'ANALYSIS' | 'PLAN' | 'CONFIRM'>('ANALYSIS');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Auto-advance analysis
  useEffect(() => {
    if (step === 'ANALYSIS') {
      const timer = setTimeout(() => {
        setStep('PLAN');
        playUnlock();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleAccept = () => {
    playClick();
    setStep('CONFIRM');
    setTimeout(() => {
      acceptRecoveryPlan();
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#030014]/95 backdrop-blur-2xl flex flex-col overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* HEADER */}
      <div className="relative z-10 p-8 flex justify-between items-center border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <HeartPulse size={24} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Recovery Mode</h2>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-wider">
              <Activity size={12} /> System Active
            </div>
          </div>
        </div>
        <button onClick={resetBehavioralState} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 relative z-10 flex flex-col md:flex-row p-8 gap-8 overflow-hidden">
        
        {/* LEFT PANEL: AI NARRATIVE */}
        <div className="w-full md:w-1/3 flex flex-col">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 flex-1 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            
            <div className="flex items-center gap-3 mb-6">
              <Brain size={20} className="text-blue-400" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">AI Analysis</span>
            </div>

            <AnimatePresence mode="wait">
              {step === 'ANALYSIS' && (
                <motion.div 
                  key="analysis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-center my-auto"
                >
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="animate-spin-slow w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" stroke="rgba(59,130,246,0.2)" strokeWidth="2" fill="none" />
                      <path d="M 50 5 A 45 45 0 0 1 95 50" stroke="#3b82f6" strokeWidth="2" fill="none" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">3</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">Missed Tasks Detected</h3>
                  <p className="text-gray-400 text-sm">Calculating optimal recovery path to prevent burnout...</p>
                </motion.div>
              )}

              {step === 'PLAN' && (
                <motion.div 
                  key="plan"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <p className="text-lg text-white leading-relaxed font-light">
                    "It happens. You've missed a few milestones, but forcing them now would risk burnout."
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    I've restructured your day. We'll start small with a <span className="text-blue-400 font-bold">Brain Kick</span>, then tackle simplified versions of your key academic tasks.
                  </p>
                  
                  <div className="mt-8 space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
                      <div className="text-xs text-gray-500 uppercase font-bold">Original Load</div>
                      <div className="text-red-400 font-bold line-through">3h 30m</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex items-center justify-between">
                      <div className="text-xs text-blue-300 uppercase font-bold">Recovery Load</div>
                      <div className="text-white font-bold">50m</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'CONFIRM' && (
                <motion.div 
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <CheckCircle size={48} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Plan Activated</h3>
                  <p className="text-gray-400">Syncing Compass...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CENTER/RIGHT: VISUALIZATION */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Map Visualization */}
          <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center items-center">
             {/* Labels */}
             <div className="absolute top-6 left-8 text-xs font-bold text-gray-500 uppercase tracking-widest">Rebalancing Map</div>
             
             <div className="relative w-full max-w-2xl h-64 flex items-center justify-between px-12">
               {/* Connecting Line */}
               <div className="absolute left-12 right-12 top-1/2 h-0.5 bg-gray-800 -z-10" />
               
               {/* Nodes */}
               <AnimatePresence>
                 {step === 'ANALYSIS' ? (
                    // Original Stressed Nodes
                    MISSED_TASKS.map((task, i) => (
                      <motion.div 
                        key={task.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="relative group"
                      >
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center mb-2">
                          <AlertTriangle size={24} className="text-red-400" />
                        </div>
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-32 text-center">
                          <div className="text-[10px] font-bold text-red-400 uppercase">Missed</div>
                          <div className="text-xs text-gray-400 truncate">{task.title}</div>
                        </div>
                      </motion.div>
                    ))
                 ) : (
                    // Recovery Nodes
                    RECOVERY_PLAN_TASKS.map((task, i) => (
                      <motion.div 
                        key={task.id}
                        initial={{ scale: 0, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => { playClick(); setSelectedTask(task.id); }}
                        className={`relative group cursor-pointer ${selectedTask === task.id ? 'z-20' : 'z-10'}`}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                          selectedTask === task.id 
                            ? 'bg-blue-500 text-white scale-110 shadow-[0_0_20px_#3b82f6]' 
                            : 'bg-[#1a1f3c] border-2 border-blue-500/30 text-blue-400 hover:border-blue-500'
                        }`}>
                          {task.type === 'WELLNESS' ? <Zap size={20}/> : task.type === 'ACADEMIC' ? <RefreshCw size={20}/> : <Activity size={20}/>}
                        </div>
                        
                        {/* Task Detail Popover */}
                        <AnimatePresence>
                          {selectedTask === task.id && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-24 left-1/2 -translate-x-1/2 w-48 bg-[#1a1f3c] border border-blue-500/50 p-4 rounded-xl shadow-xl z-30"
                            >
                              <div className="text-xs font-bold text-blue-300 mb-1">{task.type}</div>
                              <div className="font-bold text-sm text-white mb-2 leading-tight">{task.title}</div>
                              <div className="text-[10px] text-gray-400 mb-2">{task.description}</div>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-white bg-blue-500/20 px-2 py-1 rounded w-max">
                                <Clock size={10} /> {task.duration}m
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {!selectedTask && (
                          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-32 text-center opacity-50 group-hover:opacity-100 transition-opacity">
                            <div className="text-[10px] font-bold text-blue-400 uppercase">Step {i+1}</div>
                          </div>
                        )}
                      </motion.div>
                    ))
                 )}
               </AnimatePresence>
             </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex justify-between items-center">
             <div className="flex items-center gap-6">
               <div>
                 <div className="text-xs text-gray-500 uppercase font-bold mb-1">Completion Reward</div>
                 <div className="flex items-center gap-2">
                   <Shield size={18} className="text-purple-400" />
                   <span className="font-bold text-white">Resilience Badge</span>
                 </div>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div>
                 <div className="text-xs text-gray-500 uppercase font-bold mb-1">Safe Streak</div>
                 <div className="flex items-center gap-2">
                   <TrendingUp size={18} className="text-green-400" />
                   <span className="font-bold text-white">Protected</span>
                 </div>
               </div>
             </div>

             <div className="flex gap-4">
                <Button variant="outline" onClick={resetBehavioralState}>Dismiss</Button>
                {step === 'PLAN' && (
                  <Button onClick={handleAccept} className="!bg-blue-600 !border-blue-600 hover:!bg-blue-500">
                    Initialize Recovery <ArrowRight size={16} className="ml-2" />
                  </Button>
                )}
                {step === 'ANALYSIS' && (
                  <Button variant="secondary" className="opacity-50 cursor-wait">Analyzing...</Button>
                )}
             </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
