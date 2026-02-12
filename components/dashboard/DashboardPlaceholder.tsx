import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Zap, Brain, BookOpen, Target, Layout, Star, 
  ChevronRight, Play, Check, RefreshCw, Plus, 
  MessageSquare, Settings, Lock, Map, LayoutGrid, Award, X,
  GitBranch, CheckSquare, Calendar as CalendarIcon, Loader2, List,
  ArrowUp, Activity, Layers, AlertCircle, TrendingUp, BarChart, Clock,
  MoreVertical, Shield, Dumbbell, CloudRain, Sun, CloudLightning,
  Battery, BatteryWarning, HeartPulse
} from 'lucide-react';
import { Quest, SubQuest, WorkloadLevel, BurnoutRisk } from '../../types';
import { Button } from '../ui/Button';
import { useSound } from '../../hooks/useSound';
import { useDemoContext } from '../../context/DemoContext';
import { GymQuestModal } from './GymQuestModal';
import { RecoveryDashboard } from './RecoveryDashboard';

// --- NEW BEHAVIORAL COMPONENTS ---

const DailyRitualTimeline = () => {
  const phases = [
    { id: 'ACTIVATE', label: 'Activation', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400', time: 'Morning' },
    { id: 'PERFORM', label: 'Performance', icon: Target, color: 'text-primary', bg: 'bg-primary', time: 'Mid-Day' },
    { id: 'RECOVER', label: 'Recovery', icon: HeartPulse, color: 'text-purple-400', bg: 'bg-purple-400', time: 'Evening' },
  ];
  
  // Mock current time of day logic
  const currentPhaseIndex = 1; // Perform

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Daily Ritual Flow</h3>
        <span className="text-xs text-gray-500">Current Phase: <span className="text-primary font-bold">Performance</span></span>
      </div>
      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden flex">
        {phases.map((p, i) => (
          <div key={p.id} className="flex-1 relative">
             <div className={`absolute inset-0 opacity-20 ${p.bg}`} />
             {i === currentPhaseIndex && (
               <motion.div 
                 layoutId="activePhase"
                 className={`absolute inset-0 ${p.bg} shadow-[0_0_15px_currentColor]`} 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
               />
             )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {phases.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-2 ${i === currentPhaseIndex ? 'opacity-100' : 'opacity-40'}`}>
             <p.icon size={12} className={p.color} />
             <div className="text-[10px] font-bold uppercase text-gray-400">{p.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WellnessWidget = ({ workload, burnout }: { workload: WorkloadLevel, burnout: BurnoutRisk }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      className={`absolute top-48 left-8 z-30 transition-all duration-300 ${isOpen ? 'w-64 bg-[#0f0c29] border border-white/10 p-4 rounded-2xl shadow-xl' : 'w-auto'}`}
    >
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {/* Workload Weather Icon */}
        <div className="relative group">
           <div className={`p-2 rounded-full border ${workload === 'OVERLOAD' ? 'bg-red-500/10 border-red-500 text-red-500' : workload === 'RISING' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-green-500/10 border-green-500 text-green-500'}`}>
             {workload === 'OVERLOAD' ? <CloudLightning size={20} /> : workload === 'RISING' ? <CloudRain size={20} /> : <Sun size={20} />}
           </div>
        </div>

        {/* Burnout Indicator */}
        <div className="relative group">
           <div className={`p-2 rounded-full border ${burnout === 'HIGH' ? 'bg-red-500/10 border-red-500 text-red-500' : burnout === 'MODERATE' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-green-500/10 border-green-500 text-green-500'}`}>
             {burnout === 'HIGH' ? <BatteryWarning size={20} /> : <Battery size={20} />}
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase text-gray-500">Workload Weather</span>
                  <span className={`text-xs font-bold ${workload === 'OVERLOAD' ? 'text-red-500' : workload === 'RISING' ? 'text-yellow-500' : 'text-green-500'}`}>{workload}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${workload === 'OVERLOAD' ? 'bg-red-500 w-full' : workload === 'RISING' ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-1/3'}`} />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {workload === 'OVERLOAD' ? 'Storm warning. High urgency detected.' : workload === 'RISING' ? 'Pressure building. Upcoming deadlines.' : 'Skies clear. Steady pace.'}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase text-gray-500">Burnout Risk</span>
                  <span className={`text-xs font-bold ${burnout === 'HIGH' ? 'text-red-500' : burnout === 'MODERATE' ? 'text-yellow-500' : 'text-green-500'}`}>{burnout}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${burnout === 'HIGH' ? 'bg-red-500 w-full' : burnout === 'MODERATE' ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-1/3'}`} />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {burnout === 'HIGH' ? 'Critical fatigue. Rest recommended.' : burnout === 'MODERATE' ? 'Moderate strain. Monitor breaks.' : 'Optimal energy levels.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- COMPONENTS ---

const BrainKickOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="max-w-md w-full relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 animate-pulse" />
        <div className="relative bg-[#0f0c29] border border-white/10 rounded-2xl p-8 text-center overflow-hidden">
          
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Brain size={40} className="text-primary" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-2">System Wake Up</h2>
                <p className="text-gray-400 mb-8">Let's calibrate your cognitive focus. 30 seconds.</p>
                <Button onClick={() => setStep(1)} className="w-full">Initialize</Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-left"
              >
                <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Recall Check</div>
                <h3 className="text-xl font-bold mb-6">What is the derivative of sin(x)?</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button onClick={() => setStep(2)} className="p-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-primary transition-all">cos(x)</button>
                  <button onClick={() => setStep(2)} className="p-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-primary transition-all">-cos(x)</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onAnimationComplete={() => setTimeout(onComplete, 1500)}
              >
                 <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <Check size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">Systems Online</h2>
                <p className="text-gray-400">Loading your mission compass...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const CoursesModal = ({ onClose }: { onClose: () => void }) => {
  const { courses } = useDemoContext();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f0c29] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-display font-bold">Course Manager</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>
        <div className="p-6 grid gap-4">
            {courses.map(course => (
                <div key={course.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 group hover:border-white/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-white/10" style={{ backgroundColor: `${course.color}20`, color: course.color }}>
                        <BookOpen size={24} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{course.name}</h4>
                        <div className="text-xs text-gray-500">3 Active Quests • 85% Engagement</div>
                    </div>
                    <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: course.color, color: course.color }} />
                </div>
            ))}
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-white/10 text-gray-400 hover:text-white hover:border-primary/50 hover:text-primary transition-all">
                <Plus size={20} /> Add New Course
            </button>
        </div>
      </motion.div>
    </div>
  );
};

const RewardsPanel = ({ onClose }: { onClose: () => void }) => {
    const { rewards, unlockReward } = useDemoContext();
    const { playUnlock } = useSound();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={onClose}>
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0f0c29] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden relative"
            onClick={e => e.stopPropagation()}
        >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-xl font-display font-bold flex items-center gap-2"><Award className="text-yellow-400"/> Rewards Vault</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                {rewards.map(reward => (
                    <div 
                        key={reward.id} 
                        className={`p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-all cursor-pointer ${
                            reward.unlocked 
                            ? 'bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/30 hover:border-yellow-500/60' 
                            : 'bg-black/40 border-white/5 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                        }`}
                        onClick={() => {
                             if(!reward.unlocked) {
                                playUnlock();
                                unlockReward(reward.id);
                             }
                        }}
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-1 transition-all ${reward.unlocked ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-white/5 text-gray-600'}`}>
                            <Star size={32} fill={reward.unlocked ? "currentColor" : "none"} />
                        </div>
                        <div>
                            <div className="font-bold text-sm mb-1">{reward.name}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                                reward.rarity === 'LEGENDARY' ? 'bg-purple-500/20 text-purple-400' :
                                reward.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-gray-500/20 text-gray-400'
                            }`}>{reward.rarity}</div>
                        </div>
                         {!reward.unlocked && <div className="text-[10px] text-gray-500 mt-2 flex items-center gap-1"><Lock size={10}/> Click to Unlock (Demo)</div>}
                    </div>
                ))}
            </div>
        </motion.div>
        </div>
    );
};

// --- TACTICAL QUEST CARD (NEW) ---

interface TacticalQuestCardProps {
  quest: Quest;
  color: string;
  onStart: () => void;
  onGeneratePlan: () => Promise<void>;
  onPrioritize: () => void;
  onOpenHub: () => void;
  isPrioritized?: boolean;
}

const TacticalQuestCard: React.FC<TacticalQuestCardProps> = ({ quest, color, onStart, onGeneratePlan, onPrioritize, onOpenHub, isPrioritized }) => {
  const [expanded, setExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { playClick, playHover } = useSound();

  const handleBreakdown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    if (!quest.subQuests || quest.subQuests.length === 0) {
      setIsGenerating(true);
      await onGeneratePlan();
      setIsGenerating(false);
    }
    setExpanded(true);
  };

  return (
    <Reorder.Item value={quest} id={quest.id} className="relative mb-4">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        onClick={() => setExpanded(!expanded)}
        className={`bg-[#0f0c29] border rounded-xl overflow-hidden transition-all duration-300 relative group cursor-pointer ${
          expanded ? 'border-primary shadow-[0_0_30px_rgba(0,242,234,0.1)]' : 'border-white/10 hover:border-white/30'
        }`}
        style={{ borderLeftColor: color, borderLeftWidth: 4 }}
      >
        {/* Momentum Indicator Ring */}
        <div className="absolute right-4 top-4 w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center">
            <div className={`w-full h-full rounded-full border-2 border-t-transparent animate-spin ${
                quest.difficulty === 'HARD' ? 'border-red-500' : 'border-green-500'
            }`} style={{ animationDuration: '3s' }} />
            <Activity size={12} className={quest.difficulty === 'HARD' ? 'text-red-500' : 'text-green-500'} />
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 pr-10">
            <div 
              className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors cursor-pointer hover:bg-white/10"
              onClick={(e) => { e.stopPropagation(); onOpenHub(); }}
            >
              {quest.type === 'SESSION' ? <BookOpen size={20} style={{ color }} /> : 
               quest.type === 'PROJECT' ? <GitBranch size={20} style={{ color }} /> :
               quest.type === 'FITNESS' ? <Dumbbell size={20} style={{ color }} /> :
               quest.type === 'RECOVERY' ? <HeartPulse size={20} style={{ color }} /> :
               <Zap size={20} style={{ color }} />}
            </div>
            
            <div className="flex-1">
               <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{quest.title}</h3>
               <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                 <span className="flex items-center gap-1"><Clock size={12} /> {quest.duration > 0 ? `${quest.duration} min` : 'Adaptive'}</span>
                 <span className={`px-1.5 py-0.5 rounded border ${
                   quest.difficulty === 'HARD' ? 'border-red-500/30 text-red-400' : 'border-green-500/30 text-green-400'
                 }`}>{quest.difficulty}</span>
                 {isPrioritized && <span className="text-yellow-400 font-bold flex items-center gap-1"><Star size={10} fill="currentColor"/> PRIORITY</span>}
               </div>
            </div>
          </div>

          {/* Tactical Controls */}
          <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/5">
             <button 
               onClick={(e) => { e.stopPropagation(); onPrioritize(); playClick(); }}
               className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/5 text-gray-500 hover:text-yellow-400 transition-colors"
             >
               <ArrowUp size={16} />
               <span className="text-[10px] font-bold uppercase">Prioritize</span>
             </button>
             
             <button 
               onClick={handleBreakdown}
               className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/5 text-gray-500 hover:text-primary transition-colors"
             >
               <Layers size={16} />
               <span className="text-[10px] font-bold uppercase">Breakdown</span>
             </button>
             
             <button 
               onClick={(e) => { e.stopPropagation(); onOpenHub(); playClick(); }}
               className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-colors"
             >
               <BookOpen size={16} />
               <span className="text-[10px] font-bold uppercase">Content Hub</span>
             </button>
             
             <button 
               onClick={(e) => { e.stopPropagation(); onStart(); playClick(); }}
               className="flex flex-col items-center gap-1 p-2 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black transition-all"
             >
               <Play size={16} />
               <span className="text-[10px] font-bold uppercase">Focus Now</span>
             </button>
          </div>
        </div>

        {/* Expanded Mission Intelligence Panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-black/20 border-t border-white/10"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Brain size={14} className="text-primary" /> Mission Intelligence
                  </h4>
                  {isGenerating && <Loader2 size={16} className="animate-spin text-primary" />}
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                   <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                     <div className="text-xs text-gray-500 mb-2">Performance Radar</div>
                     <div className="h-20 flex items-end justify-between gap-1">
                        {/* Mock Radar Visual using bars */}
                        <div className="w-full bg-primary/20 h-[80%] rounded-t-sm relative"><div className="absolute bottom-0 w-full bg-primary h-full opacity-50" /></div>
                        <div className="w-full bg-secondary/20 h-[40%] rounded-t-sm relative"><div className="absolute bottom-0 w-full bg-secondary h-full opacity-50" /></div>
                        <div className="w-full bg-yellow-500/20 h-[90%] rounded-t-sm relative"><div className="absolute bottom-0 w-full bg-yellow-500 h-full opacity-50" /></div>
                     </div>
                     <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                        <span>Prep</span>
                        <span>Risk</span>
                        <span>Value</span>
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                      <div className="text-xs text-gray-500">AI Recommendation</div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        High priority. Your retention for this topic is fading (-12%). Completing this now will boost exam confidence by approx 8%.
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-green-400 mt-2">
                        <TrendingUp size={12} /> Momentum Building
                      </div>
                   </div>
                </div>

                {/* Sub-Quests List */}
                {quest.subQuests && quest.subQuests.length > 0 && (
                   <div className="border-t border-white/10 pt-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Tactical Breakdown</h4>
                      <div className="space-y-2">
                        {quest.subQuests.map((sq, i) => (
                           <div key={sq.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                             <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${sq.status === 'COMPLETED' ? 'bg-green-500 text-black' : 'bg-white/10 text-gray-400'}`}>
                               {sq.status === 'COMPLETED' ? <Check size={10}/> : i+1}
                             </div>
                             <span className="text-sm text-gray-300 flex-1">{sq.title}</span>
                             <span className="text-[10px] text-gray-500">{sq.duration}m</span>
                           </div>
                        ))}
                      </div>
                   </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reorder.Item>
  );
};

// --- COMMAND VIEW (NEW) ---

const CommandView: React.FC<{ 
  quests: Quest[]; 
  courses: any[]; 
  onStartSession: (q: Quest) => void;
  onGeneratePlan: (id: string) => Promise<void>;
  onOpenHub: (courseId: string) => void;
}> = ({ quests, courses, onStartSession, onGeneratePlan, onOpenHub }) => {
  const [orderedQuests, setOrderedQuests] = useState(quests);
  const [suggestionVisible, setSuggestionVisible] = useState(false);
  const { playClick, playHover } = useSound();

  useEffect(() => {
    setOrderedQuests(quests.filter(q => q.status !== 'COMPLETED')); // Only show active/available in command view mostly
  }, [quests]);

  useEffect(() => {
    const timer = setTimeout(() => setSuggestionVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePrioritize = (id: string) => {
    const index = orderedQuests.findIndex(q => q.id === id);
    if (index > -1) {
      const newOrder = [...orderedQuests];
      const [moved] = newOrder.splice(index, 1);
      newOrder.unshift(moved);
      setOrderedQuests(newOrder);
      playClick();
    }
  };

  const getQuestColor = (quest: Quest) => {
    if (quest.courseId === 'PERSONAL') return '#ffffff';
    if (quest.courseId === 'SYSTEM') return '#00f2ea';
    if (quest.type === 'FITNESS') return '#f97316'; // Orange for fitness
    if (quest.type === 'RECOVERY') return '#3b82f6'; // Blue for recovery
    return courses.find(c => c.id === quest.courseId)?.color || '#gray';
  };

  return (
    <div className="pt-48 pb-32 px-4 max-w-3xl mx-auto relative min-h-screen">
       {/* Smart Suggestion Overlay */}
       <AnimatePresence>
         {suggestionVisible && orderedQuests.length > 0 && (
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="fixed top-32 right-8 w-64 glass-panel p-4 rounded-xl border-l-4 border-primary z-40 hidden xl:block"
           >
             <div className="flex justify-between items-start mb-2">
               <div className="flex items-center gap-2 font-bold text-primary text-xs uppercase">
                 <Brain size={12} /> Smart Suggestion
               </div>
               <button onClick={() => setSuggestionVisible(false)} className="text-gray-500 hover:text-white"><X size={12}/></button>
             </div>
             <p className="text-sm text-gray-300 mb-3">
               Based on your energy level, <strong>{orderedQuests[0].title}</strong> is the optimal starting point.
             </p>
             <button 
               onClick={() => onStartSession(orderedQuests[0])}
               className="w-full py-1.5 bg-primary/20 text-primary text-xs font-bold rounded hover:bg-primary/30 transition-colors"
             >
               Start Now
             </button>
           </motion.div>
         )}
       </AnimatePresence>

       <div className="flex items-center justify-between mb-8">
         <div>
            <h2 className="text-3xl font-display font-bold flex items-center gap-2">
              <List className="text-primary" /> Mission Control
            </h2>
            <p className="text-gray-400 text-sm">Tactical overview of active objectives.</p>
         </div>
         <div className="text-xs font-bold text-gray-500 uppercase bg-white/5 px-3 py-1 rounded-full">
            {orderedQuests.length} Active Missions
         </div>
       </div>

       <Reorder.Group axis="y" values={orderedQuests} onReorder={setOrderedQuests}>
         {orderedQuests.map((quest, index) => (
           <TacticalQuestCard 
             key={quest.id} 
             quest={quest} 
             color={getQuestColor(quest)}
             onStart={() => onStartSession(quest)}
             onGeneratePlan={() => onGeneratePlan(quest.id)}
             onPrioritize={() => handlePrioritize(quest.id)}
             onOpenHub={() => onOpenHub(quest.courseId)}
             isPrioritized={index === 0}
           />
         ))}
       </Reorder.Group>

       {orderedQuests.length === 0 && (
          <div className="text-center py-20 opacity-50">
             <CheckSquare size={48} className="mx-auto mb-4 text-gray-600" />
             <h3 className="text-xl font-bold text-gray-400">All Systems Clear</h3>
             <p className="text-sm text-gray-600">No active missions. Check the Compass for new objectives.</p>
          </div>
       )}
    </div>
  );
};

// --- COMPASS VIEW (EXISTING QUEST NODE) ---

interface QuestNodeProps {
  quest: Quest;
  angle: number;
  radius: number;
  onSelect: () => void;
  isHovered: boolean;
  color: string;
}

const QuestNode: React.FC<QuestNodeProps> = ({ quest, angle, radius, onSelect, isHovered, color }) => {
  // Convert polar to cartesian
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <motion.button
      className="absolute flex items-center justify-center group pointer-events-auto"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.2, zIndex: 10 }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${quest.status === 'LOCKED' ? 'bg-black/50 border-gray-700 opacity-50' : 'bg-black/80 backdrop-blur-md'}`}
        style={{ 
          borderColor: quest.status === 'ACTIVE' ? color : (quest.status === 'LOCKED' ? '#333' : quest.status === 'COMPLETED' ? '#22c55e' : color),
          boxShadow: quest.status === 'ACTIVE' || isHovered ? `0 0 20px ${color}80` : quest.status === 'COMPLETED' ? `0 0 10px #22c55e40` : 'none'
        }}
      >
        {quest.status === 'COMPLETED' ? <Check size={20} className="text-green-500" /> : (
          <>
            {quest.type === 'BRAIN_KICK' && <Brain size={16} style={{ color }} />}
            {quest.type === 'SESSION' && <BookOpen size={16} style={{ color }} />}
            {quest.type === 'QUIZ' && <Zap size={16} style={{ color }} />}
            {quest.type === 'TEACHER' && <Target size={16} style={{ color }} />}
            {quest.type === 'PERSONAL' && <Star size={16} style={{ color }} />}
            {quest.type === 'FLASHCARD' && <RefreshCw size={16} style={{ color }} />}
            {quest.type === 'FITNESS' && <Dumbbell size={16} style={{ color }} />}
            {quest.type === 'RECOVERY' && <HeartPulse size={16} style={{ color }} />}
            {(quest.type === 'PROJECT' || quest.type === 'EXAM_PREP') && <GitBranch size={16} style={{ color }} />}
          </>
        )}
        
        {quest.status === 'LOCKED' && <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full"><Lock size={12} className="text-gray-500"/></div>}
        
        {/* Floating Label on Hover */}
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          <div className="bg-black/90 border border-white/10 px-3 py-1 rounded text-xs font-bold whitespace-nowrap">
            {quest.title} {quest.status === 'COMPLETED' && '(Done)'}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

const AIAssistant = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed right-6 bottom-32 w-80 bg-[#0f0c29]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-40"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain size={16} className="text-primary" />
              </div>
              <span className="font-bold text-sm">Focus AI</span>
            </div>
            <button onClick={onClose}><Settings size={14} className="text-gray-500" /></button>
          </div>
          
          <div className="space-y-2 mb-4">
             <div className="bg-white/5 p-3 rounded-lg text-sm text-gray-300">
               Based on your quiz performance, I've added a reinforcement mission for Calculus.
             </div>
             <div className="bg-primary/10 p-3 rounded-lg text-sm text-primary border border-primary/20">
               Suggestion: You have high energy. Attempt the Physics Lab Prep now?
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button className="text-xs bg-white/5 hover:bg-white/10 p-2 rounded border border-white/5 transition-colors">Generate Quiz</button>
            <button className="text-xs bg-white/5 hover:bg-white/10 p-2 rounded border border-white/5 transition-colors">Explain Topic</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const QuestDetailModal = ({ quest, color, onClose, onAction, onOpenHub }: { quest: Quest | null, color: string, onClose: () => void, onAction: (type: string) => void, onOpenHub: (id: string) => void }) => {
  const { generateAIPlan, updateQuestStatus, updateCalendarEvent } = useDemoContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const { playClick, playUnlock } = useSound();

  // Reset state when opening a new quest
  useEffect(() => {
    setIsAnalyzing(false);
    setAnalysisStep(0);
  }, [quest?.id]);

  if (!quest) return null;

  const canDecompose = (quest.type === 'PROJECT' || quest.type === 'EXAM_PREP') && (!quest.subQuests || quest.subQuests.length === 0);
  const hasSubQuests = quest.subQuests && quest.subQuests.length > 0;
  const isCourseQuest = quest.courseId !== 'PERSONAL' && quest.courseId !== 'SYSTEM';

  const handleGeneratePlan = async () => {
    playClick();
    setIsAnalyzing(true);
    
    // Simulate steps of AI thinking
    setTimeout(() => setAnalysisStep(1), 1000); // "Scanning"
    setTimeout(() => setAnalysisStep(2), 2000); // "Breaking Down"
    
    await generateAIPlan(quest.id);
    
    setTimeout(() => {
      setAnalysisStep(3); // Done
      setTimeout(() => setIsAnalyzing(false), 500);
    }, 500);
  };

  const handleSubQuestToggle = (subQuestId: string) => {
    playClick();
    // In a real app, we'd update context. For now, visual only or mocked via context update
    // This demonstrates interactivity
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#030014] border border-white/10 rounded-3xl p-8 max-w-2xl w-full relative overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: `0 0 50px ${color}20` }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color }}>
              {quest.courseId === 'PERSONAL' ? "Personal Quest" : quest.type === 'RECOVERY' ? "Wellness System" : "Course Mission"}
              {hasSubQuests && <span className="bg-white/10 px-2 py-0.5 rounded text-white text-[10px]">Multi-Stage</span>}
            </div>
            <h2 className="text-3xl font-display font-bold">{quest.title}</h2>
          </div>
          <div className="bg-white/5 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
            {quest.duration > 0 ? `${quest.duration} min` : 'Adaptive'}
          </div>
        </div>

        {/* --- AI DECOMPOSITION ENGINE VISUALIZER --- */}
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#0f0c29] border border-primary/30 rounded-xl p-6 mb-8 relative overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center py-4 text-center">
                 <div className="relative w-16 h-16 mb-4">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full" 
                    />
                    <Brain className="absolute inset-0 m-auto text-primary" size={24} />
                 </div>
                 
                 <div className="h-6 overflow-hidden relative w-full">
                    <AnimatePresence mode="wait">
                      {analysisStep === 0 && <motion.div key="s0" initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-20, opacity:0}} className="text-primary font-bold">Analyzing Syllabus Requirements...</motion.div>}
                      {analysisStep === 1 && <motion.div key="s1" initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-20, opacity:0}} className="text-primary font-bold">Identifying Knowledge Gaps...</motion.div>}
                      {analysisStep === 2 && <motion.div key="s2" initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-20, opacity:0}} className="text-primary font-bold">Optimizing Study Vectors...</motion.div>}
                      {analysisStep === 3 && <motion.div key="s3" initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-20, opacity:0}} className="text-green-400 font-bold">Plan Generated Successfully</motion.div>}
                    </AnimatePresence>
                 </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* --- SUB-QUEST TREE --- */}
              {hasSubQuests && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-300 flex items-center gap-2">
                      <GitBranch size={18} className="text-primary" /> Strategy Breakdown
                    </h3>
                    <div className="text-xs text-gray-500">Auto-synced to Calendar</div>
                  </div>
                  
                  <div className="relative border-l-2 border-white/10 ml-3 space-y-4 pl-6">
                    {quest.subQuests?.map((sq, idx) => (
                      <motion.div 
                        key={sq.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative"
                      >
                        {/* Connector Line */}
                        <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-6 h-0.5 bg-white/10" />
                        <div className={`absolute -left-[37px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${sq.status === 'COMPLETED' ? 'bg-green-500' : sq.status === 'AVAILABLE' ? 'bg-primary' : 'bg-gray-600'}`} />

                        <div className={`bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-4 hover:bg-white/10 transition-colors group ${sq.status === 'LOCKED' ? 'opacity-50' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-none ${sq.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-gray-400'}`}>
                             {sq.status === 'COMPLETED' ? <Check size={16} /> : <div className="text-xs font-bold">{idx + 1}</div>}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{sq.title}</h4>
                              {sq.scheduledDate && (
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-black/20 px-2 py-0.5 rounded">
                                  <CalendarIcon size={10} />
                                  {sq.scheduledDate.toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 text-[10px] text-gray-500 mt-1">
                               <span className="uppercase">{sq.type}</span> • <span>{sq.duration}m</span> • <span className={sq.difficulty === 'HARD' ? 'text-red-400' : 'text-gray-500'}>{sq.difficulty}</span>
                            </div>
                          </div>

                          {sq.status !== 'LOCKED' && sq.status !== 'COMPLETED' && (
                             <button onClick={() => onAction('START_SUB')} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-black transition-colors">
                               <Play size={14} />
                             </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* --- GENERATE BUTTON FOR LARGE TASKS --- */}
              {canDecompose && !isAnalyzing && (
                <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/30 rounded-xl p-6 mb-8 flex items-center justify-between">
                   <div>
                     <h3 className="font-bold text-primary mb-1 flex items-center gap-2"><Brain size={16}/> AI Planner Available</h3>
                     <p className="text-xs text-gray-400">This is a large task. I can break it down into manageable sub-quests for you.</p>
                   </div>
                   <Button onClick={handleGeneratePlan} className="!py-2 !px-4 text-xs">
                     Generate Plan
                   </Button>
                </div>
              )}
            </>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-white/5 p-4 rounded-xl">
             <div className="text-xs text-gray-500 uppercase font-bold">Difficulty</div>
             <div className="text-lg font-bold">{quest.difficulty}</div>
           </div>
           <div className="bg-white/5 p-4 rounded-xl">
             <div className="text-xs text-gray-500 uppercase font-bold">XP Reward</div>
             <div className="text-lg font-bold text-yellow-400">+{quest.xpReward}</div>
           </div>
        </div>

        {quest.description && (
          <p className="text-gray-400 mb-8 leading-relaxed">{quest.description}</p>
        )}
        
        {quest.subtasks && !hasSubQuests && (
          <div className="mb-8 space-y-2">
            {quest.subtasks.map((task, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-4 h-4 rounded border border-gray-600" />
                {task}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
          {quest.status !== 'LOCKED' && quest.status !== 'COMPLETED' && !hasSubQuests && (
            <Button onClick={() => onAction('START')} className="flex-1">Start Mission</Button>
          )}
          {isCourseQuest && (
             <Button onClick={() => onOpenHub(quest.courseId)} variant="secondary" className="flex-1">
               Open Course Hub
             </Button>
          )}
          {quest.status === 'COMPLETED' && (
            <Button variant="secondary" className="flex-1 cursor-default">Completed</Button>
          )}
        </div>
        
        {quest.status === 'LOCKED' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col z-10">
             <Lock size={48} className="text-gray-500 mb-4" />
             <p className="font-bold text-gray-400">Complete previous missions to unlock</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

interface DashboardProps {
  onStartSession: (quest: Quest) => void;
  onOpenExam: () => void;
  onOpenHub: (courseId: string) => void;
}

export const DashboardPlaceholder: React.FC<DashboardProps> = ({ onStartSession, onOpenExam, onOpenHub }) => {
  const { user, quests, updateQuestStatus, rewards, unlockReward, courses, addQuest, generateAIPlan, setSelectedCourseId, studentState, workloadLevel, burnoutRisk, resetBehavioralState } = useDemoContext();
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'NONE' | 'COURSES' | 'REWARDS'>('NONE');
  const [showToast, setShowToast] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'COMPASS' | 'COMMAND'>('COMPASS');
  
  const brainKickQuest = quests.find(q => q.type === 'BRAIN_KICK');
  const brainKickDone = brainKickQuest?.status === 'COMPLETED';

  const { playHover, playClick, playUnlock } = useSound();

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleQuestAction = (action: string) => {
    if (action === 'START' && selectedQuest) {
      playClick();
      onStartSession(selectedQuest);
    } else if (action === 'START_SUB') {
       playClick();
       if (selectedQuest) onStartSession(selectedQuest);
    }
  };

  const handleOpenHub = (courseId: string) => {
    playClick();
    setSelectedCourseId(courseId);
    onOpenHub(courseId);
    setSelectedQuest(null);
  };

  const handleBrainKickComplete = () => {
    playUnlock();
    if (brainKickQuest) {
       updateQuestStatus(brainKickQuest.id, 'COMPLETED');
    }
  };

  const handleAddQuest = () => {
    playClick();
    const newId = `custom_${Date.now()}`;
    addQuest({
      id: newId,
      title: 'New Study Node',
      courseId: 'PERSONAL',
      type: 'PERSONAL',
      duration: 30,
      difficulty: 'MEDIUM',
      status: 'AVAILABLE',
      aiConfidence: 100,
      xpReward: 50,
      description: "A custom session created by you."
    });
    setShowToast("New Task Added to Compass");
  };

  const activeQuest = quests.find(q => q.status === 'ACTIVE') || quests.find(q => q.status === 'AVAILABLE');

  const getQuestColor = (quest: Quest) => {
    if (quest.courseId === 'PERSONAL') return '#ffffff';
    if (quest.courseId === 'SYSTEM') return '#00f2ea';
    if (quest.type === 'FITNESS') return '#f97316';
    if (quest.type === 'RECOVERY') return '#3b82f6';
    return courses.find(c => c.id === quest.courseId)?.color || '#gray';
  };

  return (
    <div className="min-h-[110vh] bg-[#030014] overflow-x-hidden relative">
      {!brainKickDone && <BrainKickOverlay onComplete={handleBrainKickComplete} />}
      
      {/* Recovery Overlay Trigger */}
      <AnimatePresence>
        {studentState === 'RECOVERY' && <RecoveryDashboard />}
      </AnimatePresence>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* Main Container */}
      <div className="relative w-full min-h-[110vh] pb-20 pt-24">
        
        {/* Behavioral Top Widgets */}
        <div className="absolute top-24 w-full z-20">
           <DailyRitualTimeline />
        </div>
        
        {/* VIEW TOGGLE HUD */}
        <div className="absolute top-52 left-1/2 -translate-x-1/2 z-40 bg-[#0f0c29] border border-white/20 rounded-full p-1 flex shadow-xl backdrop-blur-md">
            <button 
              onClick={() => setViewMode('COMPASS')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                viewMode === 'COMPASS' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Compass
            </button>
            <button 
              onClick={() => setViewMode('COMMAND')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                viewMode === 'COMMAND' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Command
            </button>
        </div>

        {/* Wellness Indicator */}
        <WellnessWidget workload={workloadLevel} burnout={burnoutRisk} />

        {/* COMPASS MODE */}
        {viewMode === 'COMPASS' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="w-full min-h-[110vh] flex items-center justify-center relative"
          >
            {/* Core HUD */}
            <div className="absolute z-10 text-center pointer-events-none top-1/2 -translate-y-1/2">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Current Objective</div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 neon-text">
                  {activeQuest ? activeQuest.title : "All Missions Complete"}
                </h1>
                <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
                  <Zap size={14} />
                  <span className="text-sm font-bold">High Energy Detected</span>
                </div>
              </motion.div>
            </div>

            {/* COMPASS RINGS */}
            <div className="relative w-[800px] h-[800px] flex items-center justify-center scale-75 md:scale-100">
              
              {/* Inner Ring (Static Decor) */}
              <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5 flex items-center justify-center pointer-events-none">
                <div className="w-[280px] h-[280px] rounded-full border border-dashed border-white/10 animate-spin-slow" style={{ animationDuration: '60s' }} />
              </div>

              {/* Middle Ring - Course Quests */}
              <motion.div 
                className="absolute w-[500px] h-[500px] rounded-full border border-white/10 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 120, ease: "linear", repeat: Infinity }}
              >
                {quests.filter(q => q.type !== 'BRAIN_KICK' && q.type !== 'PERSONAL' && q.type !== 'FITNESS' && q.type !== 'RECOVERY').map((quest, i, arr) => (
                  <QuestNode 
                    key={quest.id} 
                    quest={quest} 
                    radius={250} 
                    angle={(360 / arr.length) * i} 
                    color={getQuestColor(quest)}
                    onSelect={() => { playClick(); setSelectedQuest(quest); }}
                    isHovered={false}
                  />
                ))}
              </motion.div>

              {/* Outer Ring - Personal, Fitness, Recovery & Rewards */}
              <motion.div 
                className="absolute w-[700px] h-[700px] rounded-full border border-white/5 border-dashed pointer-events-none"
                animate={{ rotate: -360 }}
                transition={{ duration: 180, ease: "linear", repeat: Infinity }}
              >
                {quests.filter(q => q.type === 'PERSONAL' || q.type === 'FITNESS' || q.type === 'RECOVERY').map((quest, i, arr) => (
                  <QuestNode 
                    key={quest.id} 
                    quest={quest} 
                    radius={350} 
                    angle={i * (360 / Math.max(1, arr.length)) + 180} 
                    color={getQuestColor(quest)}
                    onSelect={() => { playClick(); setSelectedQuest(quest); }}
                    isHovered={false}
                  />
                ))}
                
                {rewards.map((reward) => (
                  <div 
                    key={reward.id}
                    className="absolute flex items-center justify-center cursor-pointer pointer-events-auto"
                    style={{ 
                      left: `calc(50% + ${Math.cos(reward.position * Math.PI / 180) * 350}px)`, 
                      top: `calc(50% + ${Math.sin(reward.position * Math.PI / 180) * 350}px)` 
                    }}
                    onClick={() => { 
                      if (!reward.unlocked) {
                        playUnlock();
                        unlockReward(reward.id);
                        setShowToast(`Unlocked: ${reward.name}`); 
                      } else {
                        setShowToast(`${reward.name} (Unlocked)`);
                      }
                    }}
                  >
                    <Star size={20} className={reward.unlocked ? "text-yellow-400" : "text-gray-700"} fill={reward.unlocked ? "currentColor" : "none"} />
                  </div>
                ))}
              </motion.div>

              {/* Path Connections (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <circle cx="400" cy="400" r="150" stroke="#00f2ea" strokeWidth="1" fill="none" />
                <path d="M 400 250 L 400 150" stroke="#00f2ea" strokeWidth="2" strokeDasharray="5,5" />
              </svg>

            </div>
          </motion.div>
        )}

        {/* COMMAND MODE */}
        {viewMode === 'COMMAND' && (
           <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
           >
              <CommandView 
                quests={quests} 
                courses={courses}
                onStartSession={onStartSession}
                onGeneratePlan={generateAIPlan}
                onOpenHub={handleOpenHub}
              />
           </motion.div>
        )}

        {/* UI OVERLAYS - SHARED */}
        
        {/* Bottom Dock for Quick Access */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
           <button 
             onClick={onOpenExam}
             className="group relative flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all"
           >
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary group-hover:bg-secondary/30">
                <Target size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Exam Prep</span>
           </button>

           <div className="w-[1px] h-10 bg-white/10 mx-2" />

           <button 
             onClick={() => setActiveModal('COURSES')}
             className="group relative flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all"
           >
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/30">
                <LayoutGrid size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Courses</span>
           </button>
           
           <button 
             onClick={() => setActiveModal('REWARDS')}
             className="group relative flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all"
           >
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500/30">
                <Award size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rewards</span>
           </button>
        </div>
        
        {/* Floating AI Widget */}
        <div className="absolute bottom-28 right-8 z-30">
           <button 
             onClick={() => { playClick(); setAssistantOpen(!assistantOpen); }}
             className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_#00f2ea] hover:scale-110 transition-transform"
           >
             <Brain className="text-black" />
           </button>
        </div>
        <AIAssistant visible={assistantOpen} onClose={() => setAssistantOpen(false)} />

        {/* Add Personal Task Button */}
        <div className="absolute bottom-12 left-8 z-30">
          <button 
            onClick={handleAddQuest}
            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-3 rounded-full border border-white/10 hover:border-white/30 backdrop-blur-md transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20">
              <Plus size={16} />
            </div>
            <span className="font-bold text-sm hidden md:block">Add Task</span>
          </button>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-[#0f0c29] border border-primary/50 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50"
            >
              <Zap size={16} className="text-primary" />
              <span className="font-bold text-sm">{showToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quest Detail Modal (Only in Compass Mode for selection, or shared) */}
        <AnimatePresence>
          {selectedQuest && selectedQuest.type === 'FITNESS' ? (
            <GymQuestModal
              quest={selectedQuest}
              onClose={() => setSelectedQuest(null)}
              onStart={() => handleQuestAction('START')}
            />
          ) : selectedQuest ? (
            <QuestDetailModal 
              quest={selectedQuest} 
              color={getQuestColor(selectedQuest)}
              onClose={() => setSelectedQuest(null)} 
              onAction={handleQuestAction}
              onOpenHub={handleOpenHub}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
            {activeModal === 'COURSES' && <CoursesModal onClose={() => setActiveModal('NONE')} />}
            {activeModal === 'REWARDS' && <RewardsPanel onClose={() => setActiveModal('NONE')} />}
        </AnimatePresence>

        {/* User Mode Indicator */}
        <div className="absolute top-52 right-8 bg-white/5 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md">
           <div className="text-xs text-gray-500 uppercase font-bold">Mode</div>
           <div className="font-bold text-primary flex items-center gap-2">
             {user?.mode === 'SOLO' ? <Map size={14} /> : <Target size={14} />}
             {user?.mode || 'SOLO'}
           </div>
        </div>

      </div>
    </div>
  );
};
