import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, CheckCircle, Brain, ChevronRight, 
  Clock, Shield, Zap, X, Volume2, VolumeX, Maximize2,
  RefreshCw, Award, ArrowRight, ThumbsUp, ThumbsDown, BarChart2,
  Sparkles, Coffee
} from 'lucide-react';
import { Quest, Subtask, SessionPhase } from '../../types';
import { Button } from '../ui/Button';
import { useSound } from '../../hooks/useSound';
import { useDemoContext } from '../../context/DemoContext';

interface FocusModeProps {
  quest: Quest;
  onExit: () => void;
  onComplete: () => void;
}

// Helper Component for 3D Flashcard Flip
const Flashcard: React.FC<{ card: any }> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="h-40 cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-4 text-center backface-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <span className="font-bold text-xl">{card.front}</span>
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 bg-primary/10 border border-primary/50 rounded-2xl flex items-center justify-center p-4 text-center backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)' 
          }}
        >
          <span className="text-primary font-bold text-sm">{card.back}</span>
        </div>
      </motion.div>
    </div>
  );
};

export const FocusMode: React.FC<FocusModeProps> = ({ quest, onExit, onComplete }) => {
  const { updateQuestStatus, activeSession, startSession, updateSession, endSession } = useDemoContext();
  
  // Local UI state (transient)
  const [pulseVisible, setPulseVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [realityShift, setRealityShift] = useState(0); // 0 to 1
  const [ritualStep, setRitualStep] = useState(0); // 0: Pulse, 1: Reflection, 2: Action
  
  const { playHover, playClick, playUnlock } = useSound();

  // Initialize Session if not present
  useEffect(() => {
    if (!activeSession || activeSession.questId !== quest.id) {
      startSession(quest.id);
    }
  }, [quest.id, activeSession?.questId, startSession]); // Safe dependency check

  // Derived state from context
  const tasks = activeSession?.tasks || [];
  const currentTaskIndex = activeSession?.currentTaskIndex || 0;
  const elapsed = activeSession?.elapsed || 0;
  const phase = activeSession?.phase || 'WARMUP';
  const isPaused = activeSession?.isPaused || false;
  const currentTask = tasks[currentTaskIndex];

  // Timer & Pulse Logic
  useEffect(() => {
    if (isPaused || showSummary || !activeSession) return;

    const interval = setInterval(() => {
      updateSession({ elapsed: elapsed + 1 });
      
      // Random Attention Pulse every ~30s for demo
      if (elapsed % 30 === 0 && elapsed > 0 && phase === 'FOCUS') {
        setPulseVisible(true);
        setTimeout(() => setPulseVisible(false), 4000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, phase, showSummary, elapsed, updateSession, activeSession]);

  // Phase Management
  useEffect(() => {
    if (phase === 'WARMUP' && elapsed > 4) {
      updateSession({ phase: 'FOCUS' });
    }
  }, [phase, elapsed, updateSession]);

  // Reality Shift based on progress
  useEffect(() => {
    if (tasks.length > 0) {
      const progress = currentTaskIndex / tasks.length;
      setRealityShift(progress);
    }
  }, [currentTaskIndex, tasks.length]);

  const handleTaskComplete = () => {
    playUnlock();
    setFeedbackVisible(true);
  };

  const handleDifficultyFeedback = (rating: 'EASY' | 'HARD') => {
    playClick();
    setFeedbackVisible(false);
    
    // Update completed status
    const newTasks = [...tasks];
    if (newTasks[currentTaskIndex]) {
        newTasks[currentTaskIndex].completed = true;
    }
    
    if (currentTaskIndex < tasks.length - 1) {
      updateSession({ 
        tasks: newTasks, 
        currentTaskIndex: currentTaskIndex + 1 
      });
    } else {
      updateSession({ tasks: newTasks, phase: 'RITUAL_CLOSING' });
      setShowSummary(true);
      updateQuestStatus(quest.id, 'COMPLETED');
    }
  };

  const handleExit = () => {
    onExit();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // STRICT LOADING STATE
  if (!activeSession || activeSession.questId !== quest.id) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030014] text-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-display font-bold tracking-widest animate-pulse text-primary">INITIALIZING NEURAL LINK...</h2>
        <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Calibrating Focus Environment</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#030014] text-white overflow-hidden flex flex-col">
      {/* REALITY SHIFT BACKGROUND */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-[2000ms]"
        style={{
          background: `
            radial-gradient(circle at center, 
            ${realityShift > 0.5 ? '#1a1f3c' : '#030014'} 0%, 
            #000000 100%)
          `
        }}
      >
        <div 
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
          style={{ opacity: 0.2 - (realityShift * 0.1) }} 
        />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transition-all duration-1000" style={{ width: `${((currentTaskIndex) / tasks.length) * 100}%` }} />
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-20 h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#030014]/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="font-display font-bold text-lg tracking-wide">{quest.title}</span>
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
            {phase === 'RITUAL_CLOSING' ? 'COMPLETION' : phase} MODE
          </span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <Clock size={16} className="text-primary" />
          <span className="font-mono text-xl font-bold">{formatTime(elapsed)}</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-gray-400 hover:text-white transition-colors">
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <Button variant="outline" className="!py-2 !px-4 text-xs" onClick={handleExit}>
            Exit Session
          </Button>
        </div>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="relative z-10 flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        
        {/* LEFT PANEL: TASK LIST */}
        <aside className="col-span-3 border-r border-white/10 bg-[#050510]/50 p-6 flex flex-col relative hidden md:flex">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Mission Breakdown</h3>
          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <div 
                key={task.id}
                className={`p-4 rounded-xl border transition-all duration-500 ${
                  task.completed 
                    ? 'bg-green-500/10 border-green-500/30 opacity-50' 
                    : idx === currentTaskIndex 
                    ? 'bg-primary/10 border-primary/50 scale-105 shadow-[0_0_15px_rgba(0,242,234,0.1)]' 
                    : 'bg-white/5 border-white/5 text-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : (
                    <div className={`w-4 h-4 rounded-full border-2 ${idx === currentTaskIndex ? 'border-primary' : 'border-gray-600'}`} />
                  )}
                  <span className="font-bold text-sm">{task.title}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto">
             <div className="bg-white/5 p-4 rounded-xl border border-white/10">
               <div className="flex items-center gap-2 mb-2">
                 <Brain size={16} className="text-purple-400" />
                 <span className="text-xs font-bold uppercase text-purple-400">Cognitive Load</span>
               </div>
               <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                 <div className="h-full bg-purple-500 w-3/4" />
               </div>
               <p className="text-xs text-gray-500 mt-2">Optimal range. Keep steady pace.</p>
             </div>
          </div>
        </aside>

        {/* CENTER PANEL: WORKSPACE */}
        <section className="col-span-12 md:col-span-6 relative flex flex-col p-8 md:p-12 overflow-y-auto">
          <div className="flex-1 w-full max-w-2xl mx-auto min-h-[500px] flex flex-col">
            
            {phase === 'WARMUP' && (
              <div key="warmup" className="flex-1 flex flex-col items-center justify-center text-center h-full animate-in fade-in zoom-in duration-500 fill-mode-forwards">
                <div className="w-24 h-24 rounded-full border-2 border-primary border-t-transparent animate-spin mb-8" />
                <h2 className="text-3xl font-display font-bold mb-4">Calibrating Focus Environment</h2>
                <p className="text-gray-400">Eliminating digital noise. Syncing task parameters.</p>
              </div>
            )}

            {phase === 'FOCUS' && !feedbackVisible && !showSummary && currentTask && (
              <div key={`task-${currentTaskIndex}`} className="flex-1 w-full animate-in slide-in-from-bottom-4 duration-500 fill-mode-forwards">
                {/* DYNAMIC CONTENT RENDERER */}
                {currentTask.type === 'READING' && (
                  <div className="prose prose-invert lg:prose-xl">
                    <h2 className="text-4xl font-display font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">
                      {currentTask.content.heading}
                    </h2>
                    
                    {currentTask.content.isGraph ? (
                        <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                            {/* Mock Graph */}
                            <div className="h-64 flex items-end justify-between px-4 pb-4 border-l border-b border-white/20 relative">
                                <div className="absolute top-4 left-4 text-xs text-gray-500">Velocity (m/s)</div>
                                <div className="absolute bottom-[-24px] right-0 text-xs text-gray-500">Time (s)</div>
                                <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0,100 Q50,0 100,20" fill="none" stroke="#00f2ea" strokeWidth="2" />
                                    <circle cx="50" cy="50" r="2" fill="#ff0055" />
                                </svg>
                                {/* Grid lines */}
                                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                                    {[...Array(16)].map((_, i) => <div key={i} className="border-r border-t border-white/5" />)}
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                      {currentTask.content.text}
                    </div>
                  </div>
                )}

                {currentTask.type === 'FLASHCARDS' && (
                  <div className="h-full flex flex-col justify-center">
                    <h3 className="text-center font-display font-bold text-2xl mb-8">Concept Recall</h3>
                    <div className="grid gap-6">
                      {currentTask.content.map((card: any, i: number) => (
                        <Flashcard key={i} card={card} />
                      ))}
                    </div>
                  </div>
                )}

                {currentTask.type === 'QUIZ' && (
                  <div className="h-full flex flex-col justify-center">
                    <h3 className="text-center font-display font-bold text-2xl mb-8">Verification Checkpoint</h3>
                    <div className="bg-[#0f0c29] border border-white/10 rounded-3xl p-8">
                       <p className="text-xl font-bold mb-8">{currentTask.content.question}</p>
                       <div className="space-y-4">
                         {currentTask.content.options.map((opt: string, i: number) => (
                           <button 
                             key={i} 
                             className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-primary hover:bg-white/5 transition-all"
                             onClick={() => {
                               // Simple logic for demo: correct answer just completes task
                               if (i === currentTask.content.correct) handleTaskComplete();
                             }}
                           >
                             {opt}
                           </button>
                         ))}
                       </div>
                    </div>
                  </div>
                )}

                {/* Continue Button for Non-Interactive Types */}
                {currentTask.type !== 'QUIZ' && (
                  <div className="mt-12 flex justify-center">
                    <Button onClick={handleTaskComplete}>
                      Mark Complete <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* ADAPTIVE FEEDBACK INTERSTITIAL */}
            {feedbackVisible && (
              <div key="feedback" className="flex-1 flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl font-bold mb-8">Adaptive Difficulty Check</h2>
                <div className="flex gap-6">
                   <button 
                     onClick={() => handleDifficultyFeedback('EASY')}
                     className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-green-400 hover:bg-green-400/10 transition-all group"
                   >
                     <ThumbsUp size={32} className="text-gray-400 group-hover:text-green-400" />
                     <span className="font-bold">Too Easy</span>
                   </button>
                   <button 
                     onClick={() => handleDifficultyFeedback('HARD')}
                     className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-red-400 hover:bg-red-400/10 transition-all group"
                   >
                     <ThumbsDown size={32} className="text-gray-400 group-hover:text-red-400" />
                     <span className="font-bold">Hard</span>
                   </button>
                </div>
                <p className="text-gray-500 mt-8 text-sm">System will adjust next tasks based on your response.</p>
              </div>
            )}

            {/* COMPLETION RITUAL - UPDATED FOR IDENTITY REINFORCEMENT */}
            {(showSummary || phase === 'RITUAL_CLOSING') && (
              <div key="ritual" className="flex-1 flex flex-col items-center justify-center text-center h-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
                
                <AnimatePresence mode="wait">
                  {ritualStep === 0 && (
                    <motion.div 
                      key="pulse"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative mb-8">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.4)] animate-pulse">
                          <CheckCircle size={64} className="text-white" />
                        </div>
                        <motion.div 
                          className="absolute inset-0 rounded-full border-2 border-white/20"
                          animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <h2 className="text-4xl font-display font-bold mb-2">Session Complete</h2>
                      <p className="text-gray-400 mb-8 text-lg">Focus Maintained: <span className="text-white font-bold">{formatTime(elapsed)}</span></p>
                      
                      <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10 mb-8">
                        <span className="text-primary font-bold uppercase text-sm tracking-widest">Concept Strength Increased</span>
                      </div>

                      <div className="flex gap-4">
                        <Button onClick={() => setRitualStep(1)}>Begin Safe Stop</Button>
                      </div>
                    </motion.div>
                  )}

                  {ritualStep === 1 && (
                    <motion.div
                      key="reflection"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-full max-w-md"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left">
                        <div className="flex items-center gap-3 mb-4">
                          <Sparkles size={20} className="text-primary" />
                          <h3 className="font-bold text-lg">Identity Reinforcement</h3>
                        </div>
                        <p className="text-gray-300 mb-6">You showed up today. That matters more than perfection.</p>
                        <p className="text-sm text-gray-500 mb-6 font-bold uppercase tracking-widest">What stuck with you?</p>
                        <textarea 
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none h-32 resize-none mb-6"
                          placeholder="One key takeaway..."
                        />
                        <Button onClick={() => setRitualStep(2)} className="w-full">Save & Close Loop</Button>
                      </div>
                    </motion.div>
                  )}

                  {ritualStep === 2 && (
                    <motion.div
                      key="action"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full max-w-lg"
                    >
                      <h2 className="text-2xl font-bold mb-8">Safe Stop Protocol</h2>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <button 
                          onClick={onComplete}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-left group transition-all"
                        >
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
                            <Coffee size={20} />
                          </div>
                          <div className="font-bold mb-1">Recover</div>
                          <div className="text-xs text-gray-500">Step away for 15m</div>
                        </button>

                        <button 
                          onClick={onComplete}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-left group transition-all"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                            <ArrowRight size={20} />
                          </div>
                          <div className="font-bold mb-1">Next Session</div>
                          <div className="text-xs text-gray-500">If capacity allows</div>
                        </button>
                      </div>
                      
                      <p className="text-gray-500 text-sm">Session logged. <span className="text-primary font-bold">Knowledge Stability: Strengthening</span></p>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

          </div>

          {/* Attention Pulse Overlay */}
          <AnimatePresence>
            {pulseVisible && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-8 left-1/2 -translate-x-1/2 bg-primary/20 backdrop-blur-md border border-primary/50 text-primary px-6 py-2 rounded-full flex items-center gap-3 pointer-events-none"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="font-bold text-sm">Maintain Focus Rhythm</span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* RIGHT PANEL: AI ASSISTANT */}
        <aside className="col-span-3 border-l border-white/10 bg-[#050510]/50 p-6 flex-col hidden md:flex">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
               <Brain size={16} />
             </div>
             <span className="font-bold text-sm">Focus Assistant</span>
           </div>

           <div className="flex-1 overflow-y-auto space-y-4 pr-2">
             <div className="bg-white/5 p-3 rounded-lg rounded-tl-none border border-white/10 text-sm text-gray-300">
               Welcome to the session. I've prepared the material. Focus on the core concept first.
             </div>
             {currentTask?.type === 'QUIZ' && (
                <div className="bg-primary/10 p-3 rounded-lg rounded-tl-none border border-primary/20 text-sm text-primary">
                  Hint: Think about the direction vector.
                </div>
             )}
           </div>

           <div className="mt-4">
             <div className="relative">
               <input 
                type="text" 
                placeholder="Ask about this topic..." 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
               />
               <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                 <ArrowRight size={16} />
               </button>
             </div>
           </div>
        </aside>

      </main>
    </div>
  );
};
