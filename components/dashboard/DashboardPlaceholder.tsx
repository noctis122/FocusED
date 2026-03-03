import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Zap, Brain, BookOpen, Target, Layout, Star, 
  ChevronRight, Play, Check, RefreshCw, Plus, 
  MessageSquare, Settings, Lock, Map, LayoutGrid, Award, X,
  GitBranch, CheckSquare, Calendar as CalendarIcon, Loader2, List,
  ArrowUp, Activity, Layers, AlertCircle, TrendingUp, BarChart, Clock,
  MoreVertical, Shield, Dumbbell, CloudRain, Sun, CloudLightning,
  Battery, BatteryWarning, HeartPulse, Compass as CompassIcon, Anchor,
  AlertTriangle, Split, Sparkles, HelpCircle, ChevronDown, ArrowRight
} from 'lucide-react';
import { Quest, SubQuest, WorkloadLevel, BurnoutRisk } from '../../types';
import { Button } from '../ui/Button';
import { useSound } from '../../hooks/useSound';
import { useDemoContext } from '../../context/DemoContext';
import { GymQuestModal } from './GymQuestModal';
import { RecoveryDashboard } from './RecoveryDashboard';

// --- NEW BEHAVIORAL COMPONENTS ---

const DailyCapacityMeter = ({ capacity }: { capacity: number }) => {
  return (
    <div className="absolute top-24 left-8 z-30">
      <div className="glass-panel p-3 rounded-2xl border-l-4 border-primary shadow-lg max-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <Battery size={14} className="text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Daily Capacity</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${capacity}%` }}
            className={`h-full ${capacity > 90 ? 'bg-red-500' : capacity > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
          />
        </div>
        <div className="text-[10px] text-gray-500 text-right">
          {capacity > 90 ? 'Critical Load' : capacity > 70 ? 'Heavy Load' : 'Safe Load'}
        </div>
      </div>
    </div>
  );
};

const BrainKickOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const { playClick } = useSound();

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="init"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin mb-6 mx-auto" />
            <h2 className="text-3xl font-display font-bold">Neural Sync Initiated</h2>
            <p className="text-gray-400">Calibrating daily focus parameters...</p>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="action"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
             <h2 className="text-4xl font-display font-bold mb-4">Ready to Begin?</h2>
             <p className="text-gray-400 max-w-md mx-auto mb-8">
               Your cognitive load is optimal. Let's start with a quick 2-minute activation task.
             </p>
             <Button onClick={() => { playClick(); onComplete(); }} className="!text-lg !px-8 !py-4">
               Activate Systems <Zap size={20} className="ml-2" />
             </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CoursesModal = ({ onClose, onOpenHub }: { onClose: () => void, onOpenHub: (id: string) => void }) => {
  const { courses } = useDemoContext();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f0c29] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-display font-bold">Active Courses</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {courses.map(course => (
             <div 
               key={course.id} 
               className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer group" 
               onClick={() => { onOpenHub(course.id); onClose(); }}
             >
               <div className="flex justify-between items-start mb-2">
                 <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5" style={{ color: course.color }}>
                   <BookOpen size={20} />
                 </div>
                 <div className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-gray-400">{course.progress}%</div>
               </div>
               <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">{course.name}</h4>
               <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>
             </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const RewardsPanel = ({ onClose }: { onClose: () => void }) => {
  const { rewards, user } = useDemoContext();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-[#0f0c29] border-l border-white/10 p-8 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold">Profile & Rewards</h2>
          <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-white" /></button>
        </div>

        {/* User Stats */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
             <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
               <span className="font-bold text-xl">{user?.name?.charAt(0) || 'U'}</span>
             </div>
          </div>
          <div>
            <div className="text-xl font-bold">{user?.name}</div>
            <div className="text-sm text-gray-400">{user?.level} • {user?.mode} Mode</div>
          </div>
        </div>

        {/* Rewards Grid */}
        <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Unlocked Achievements</h3>
        <div className="grid grid-cols-2 gap-4">
           {rewards.map(reward => (
             <div key={reward.id} className={`p-4 rounded-xl border ${reward.unlocked ? 'bg-white/5 border-white/10' : 'bg-black/40 border-white/5 opacity-50'}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center mb-3">
                   <Award size={20} className={reward.unlocked ? "text-yellow-400" : "text-gray-600"} />
                </div>
                <div className="font-bold text-sm mb-1">{reward.name}</div>
                <div className="text-[10px] text-gray-500 uppercase">{reward.rarity}</div>
             </div>
           ))}
        </div>
      </motion.div>
    </div>
  );
};

const AIBreakdownView = ({ quest, onStart }: { quest: Quest, onStart: () => void }) => {
  const [animationStep, setAnimationStep] = useState<'IDLE' | 'SCANNING' | 'SPLITTING' | 'RESULT'>('IDLE');
  const { playUnlock, playHover } = useSound();

  // Auto-play animation sequence on mount if subQuests exist
  useEffect(() => {
    if (animationStep === 'IDLE') {
      setTimeout(() => setAnimationStep('SCANNING'), 500);
    }
    if (animationStep === 'SCANNING') {
      setTimeout(() => setAnimationStep('SPLITTING'), 1500);
    }
    if (animationStep === 'SPLITTING') {
      setTimeout(() => {
        setAnimationStep('RESULT');
        playUnlock();
      }, 1500);
    }
  }, [animationStep]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black/20 border border-white/10 mt-6 min-h-[300px] flex flex-col">
      
      {/* Visualization Canvas */}
      <div className="relative h-64 flex items-center justify-center overflow-hidden border-b border-white/10 bg-[#050510]">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

        {/* --- STAGE: SCANNING --- */}
        <AnimatePresence>
          {(animationStep === 'SCANNING' || animationStep === 'IDLE') && (
            <motion.div 
              key="central-node"
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary flex items-center justify-center relative shadow-[0_0_40px_rgba(0,242,234,0.3)]">
                <Target size={32} className="text-primary" />
                {animationStep === 'SCANNING' && (
                  <>
                    <motion.div 
                      className="absolute inset-0 border-2 border-primary rounded-2xl"
                      animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="absolute -bottom-8 bg-black/80 px-3 py-1 rounded text-xs text-primary border border-primary/30">
                      Analyzing Complexity...
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- STAGE: SPLITTING & RESULT --- */}
        {(animationStep === 'SPLITTING' || animationStep === 'RESULT') && (
          <div className="absolute inset-0 flex items-center justify-center">
             {/* Central Ghost Node */}
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 0.2 }}
               className="absolute w-20 h-20 rounded-2xl border border-dashed border-white/30 flex items-center justify-center"
             >
               <Target size={24} />
             </motion.div>

             {/* Branching Nodes */}
             {quest.subQuests?.map((sq, i) => {
               // Calculate fan-out positions
               const count = quest.subQuests?.length || 1;
               const spread = 120; // degrees
               const startAngle = -spread / 2;
               const angleStep = spread / (count - 1 || 1);
               const angle = startAngle + (i * angleStep);
               const radian = (angle - 90) * (Math.PI / 180); // -90 to point upwards
               const radius = 100;
               const x = Math.cos(radian) * radius;
               const y = Math.sin(radian) * radius;

               return (
                 <motion.div
                   key={sq.id}
                   initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                   animate={{ x, y: y + 40, scale: 1, opacity: 1 }} // y + 40 to push down slightly
                   transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                   className="absolute flex flex-col items-center"
                 >
                   <div className="w-10 h-10 rounded-full bg-[#0f0c29] border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,234,0.2)] z-10">
                     <span className="text-xs font-bold text-white">{i+1}</span>
                   </div>
                   {/* Connecting Line (Pseudo) */}
                   <motion.div 
                     initial={{ height: 0 }} 
                     animate={{ height: radius }} 
                     className="absolute bottom-1/2 w-0.5 bg-gradient-to-t from-primary/50 to-transparent -z-10 origin-bottom"
                     style={{ transform: `rotate(${angle + 90}deg)`, height: radius }} 
                   />
                 </motion.div>
               );
             })}
          </div>
        )}
      </div>

      {/* --- DETAILS PANEL --- */}
      <AnimatePresence>
        {animationStep === 'RESULT' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 p-6 bg-[#0a0a0a]"
          >
            {/* Emotional Safety Header */}
            {quest.emotionalSupportMessage && (
              <div className="flex items-start gap-3 mb-6 p-3 bg-primary/10 border border-primary/20 rounded-xl">
                <Sparkles size={16} className="text-primary mt-0.5 flex-none" />
                <p className="text-sm text-primary/90 leading-tight">
                  <span className="font-bold">AI Support:</span> {quest.emotionalSupportMessage}
                </p>
              </div>
            )}

            {/* Subtask Ladder */}
            <div className="space-y-3 mb-6">
              {quest.subQuests?.map((sq, i) => (
                <div key={sq.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className={`flex-none w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    sq.status === 'COMPLETED' ? 'bg-green-500 text-black' : 'bg-white/10 text-gray-400'
                  }`}>
                    {sq.status === 'COMPLETED' ? <Check size={12}/> : i+1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-sm font-bold text-white truncate">{sq.title}</span>
                      <span className="text-[10px] font-bold text-gray-500 bg-black/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock size={10} /> {sq.duration}m
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className={`uppercase font-bold text-[10px] ${
                        sq.difficulty === 'HARD' ? 'text-red-400' : 'text-gray-500'
                      }`}>{sq.difficulty}</span>
                      <span>•</span>
                      <span className="truncate">{sq.microObjective || 'Step objective'}</span>
                    </div>
                  </div>
                  {/* Tool Icon */}
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                    {sq.type === 'READING' && <BookOpen size={14} />}
                    {sq.type === 'PRACTICE' && <Target size={14} />}
                    {sq.type === 'WORKOUT' && <Dumbbell size={14} />}
                    {sq.type === 'MEDITATION' && <HeartPulse size={14} />}
                    {(sq.type === 'REVIEW' || sq.type === 'MOCK_EXAM') && <RefreshCw size={14} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Rationale & Actions */}
            <div className="border-t border-white/10 pt-4">
               {quest.aiRationale && (
                 <div className="mb-6">
                   <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                     <Brain size={12} /> Why this breakdown?
                   </h4>
                   <p className="text-xs text-gray-400 leading-relaxed italic border-l-2 border-white/10 pl-3">
                     "{quest.aiRationale}"
                   </p>
                 </div>
               )}

               <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 mb-4">
                 <div className="text-xs text-gray-400">Total Safe Commitment</div>
                 <div className="text-sm font-bold text-white">~{quest.duration} minutes</div>
               </div>

               <Button onClick={onStart} className="w-full">
                 Start Step 1: {quest.subQuests?.[0]?.title || 'Focus Session'} <ArrowRight size={16} className="ml-2" />
               </Button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NowModeCard = ({ quest, onStart }: { quest: Quest, onStart: () => void }) => {
  const { playClick } = useSound();
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const intensityColor = quest.intensity === 'DEEP' ? 'text-purple-400 border-purple-400/30 bg-purple-400/10' : 
                         quest.intensity === 'MEDIUM' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' : 
                         'text-green-400 border-green-400/30 bg-green-400/10';

  const urgencyGlow = quest.deadlineUrgency === 'HIGH' ? 'shadow-[0_0_30px_rgba(239,68,68,0.2)] border-red-500/50' :
                      quest.deadlineUrgency === 'MODERATE' ? 'shadow-[0_0_20px_rgba(245,158,11,0.1)] border-yellow-500/30' :
                      'border-white/10';

  const hasSubQuests = quest.subQuests && quest.subQuests.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-full max-w-lg mx-auto bg-[#0a0a0a] border rounded-3xl p-8 relative overflow-hidden transition-all duration-500 ${urgencyGlow}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            <Zap size={12} /> Next Safe Step
          </span>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${intensityColor}`}>
          {quest.intensity} Focus
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">
        {quest.title}
      </h1>

      <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-white" />
          <span className="text-white font-bold">{quest.duration} min</span> commitment
        </div>
        {quest.deadlineUrgency === 'HIGH' && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={16} />
            <span className="font-bold">Due Soon</span>
          </div>
        )}
      </div>

      {!showBreakdown ? (
        <div className="space-y-3">
          <Button onClick={onStart} className="w-full !py-4 !text-lg">
            Start Focus Session <Play size={20} className="ml-2 fill-current" />
          </Button>
          
          {hasSubQuests && (
            <button 
              onClick={() => setShowBreakdown(true)}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
            >
              <Split size={14} className="group-hover:text-primary transition-colors" />
              How FocusED Makes This Easier
            </button>
          )}
          
          <div className="text-center pt-2">
            <button className="text-xs text-gray-500 hover:text-white transition-colors">
              Defer to later (Adjust Schedule)
            </button>
          </div>
        </div>
      ) : (
        // EXPANDED BREAKDOWN VIEW
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <button 
             onClick={() => setShowBreakdown(false)}
             className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-white mb-2"
           >
             <ChevronDown size={14} className="rotate-180" /> Close Breakdown
           </button>
           <AIBreakdownView quest={quest} onStart={onStart} />
        </div>
      )}
    </motion.div>
  );
};

// --- TIMELINE VIEW ---

const TimelineView = ({ quests, onStart }: { quests: Quest[], onStart: (q: Quest) => void }) => {
  return (
    <div className="max-w-2xl mx-auto pt-8">
      <div className="flex items-center justify-between mb-6 px-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Today's Flow</h3>
        <span className="text-xs text-gray-500">Auto-balanced by AI</span>
      </div>
      
      <div className="space-y-4 px-4 pb-24">
        {quests.map((quest, i) => (
          <motion.div 
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl border border-white/5 bg-white/5 flex items-center gap-4 ${quest.status === 'COMPLETED' ? 'opacity-50' : 'hover:bg-white/10 cursor-pointer'}`}
            onClick={() => quest.status !== 'COMPLETED' && onStart(quest)}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
              quest.status === 'COMPLETED' ? 'bg-green-500/20 border-green-500 text-green-500' :
              quest.intensity === 'DEEP' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 
              'bg-white/5 border-white/10 text-gray-400'
            }`}>
              {quest.status === 'COMPLETED' ? <Check size={16} /> : <div className="text-xs font-bold">{quest.duration}m</div>}
            </div>
            
            <div className="flex-1">
              <h4 className={`font-bold text-sm ${quest.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-white'}`}>{quest.title}</h4>
              <div className="flex gap-3 text-[10px] text-gray-500 mt-1">
                <span className="uppercase">{quest.type}</span>
                {quest.deadlineUrgency === 'HIGH' && <span className="text-red-400 font-bold">Urgent</span>}
                {quest.subQuests && <span className="flex items-center gap-1"><Split size={8} /> {quest.subQuests.length} Steps</span>}
              </div>
            </div>

            {quest.status !== 'COMPLETED' && (
              <div className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-primary">
                <Play size={16} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
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
  isBlurred?: boolean;
}

const QuestNode: React.FC<QuestNodeProps> = ({ quest, angle, radius, onSelect, isHovered, color, isBlurred }) => {
  // Convert polar to cartesian
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <motion.button
      className={`absolute flex items-center justify-center group pointer-events-auto transition-all duration-500 ${isBlurred ? 'blur-sm opacity-30 scale-75' : 'blur-0 opacity-100 scale-100'}`}
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
      initial={{ scale: 0 }}
      animate={{ scale: isBlurred ? 0.8 : 1 }}
      whileHover={!isBlurred ? { scale: 1.2, zIndex: 10 } : {}}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      disabled={isBlurred}
    >
      <div className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${quest.status === 'LOCKED' ? 'bg-black/50 border-gray-700 opacity-50' : 'bg-black/80 backdrop-blur-md'}`}
        style={{ 
          borderColor: quest.status === 'ACTIVE' ? color : (quest.status === 'LOCKED' ? '#333' : quest.status === 'COMPLETED' ? '#22c55e' : color),
          boxShadow: !isBlurred && (quest.status === 'ACTIVE' || isHovered) ? `0 0 20px ${color}80` : 'none'
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
        {!isBlurred && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
            <div className="bg-black/90 border border-white/10 px-3 py-1 rounded text-xs font-bold whitespace-nowrap">
              {quest.title}
            </div>
          </div>
        )}
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
  const { generateAIPlan } = useDemoContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const { playClick } = useSound();

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
             <div className="text-xs text-gray-500 uppercase font-bold">Concept Strength</div>
             <div className="text-lg font-bold text-green-400">Improving</div>
           </div>
        </div>

        {quest.description && (
          <p className="text-gray-400 mb-8 leading-relaxed">{quest.description}</p>
        )}
        
        <div className="flex gap-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
          {quest.status !== 'LOCKED' && quest.status !== 'COMPLETED' && !hasSubQuests && (
            <Button onClick={() => onAction('START')} className="flex-1">Commit Time</Button>
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
  const { 
    user, quests, updateQuestStatus, rewards, unlockReward, courses, addQuest, 
    generateAIPlan, setSelectedCourseId, studentState, workloadLevel, burnoutRisk, 
    resetBehavioralState, dailyCapacity 
  } = useDemoContext();
  
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'NONE' | 'COURSES' | 'REWARDS'>('NONE');
  const [showToast, setShowToast] = useState<string | null>(null);
  const [dashboardLayer, setDashboardLayer] = useState<'NOW' | 'TIMELINE' | 'COMPASS'>('NOW');
  
  const brainKickQuest = quests.find(q => q.type === 'BRAIN_KICK');
  const brainKickDone = brainKickQuest?.status === 'COMPLETED';

  const { playHover, playClick, playUnlock } = useSound();

  // Determine Priority Quest for NOW mode
  // Logic: First BRAIN_KICK if not done, then High Urgency, then others
  const priorityQuest = quests.find(q => q.type === 'BRAIN_KICK' && q.status !== 'COMPLETED')
                        || quests.find(q => q.status !== 'COMPLETED' && q.status !== 'LOCKED' && q.deadlineUrgency === 'HIGH') 
                        || quests.find(q => q.status !== 'COMPLETED' && q.status !== 'LOCKED') 
                        || quests[0];

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
      intensity: 'LIGHT',
      deadlineUrgency: 'LOW',
      status: 'AVAILABLE',
      aiConfidence: 100,
      description: "A custom session created by you."
    });
    setShowToast("New Task Added to Timeline");
  };

  const handleAutoChoice = () => {
    playClick();
    if(priorityQuest) {
      onStartSession(priorityQuest);
    }
  };

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

      {/* User Aura (Consistency Indicator) */}
      <div className="fixed top-6 right-6 z-50 pointer-events-none">
         <div className="w-12 h-12 rounded-full border-2 border-white/20 shadow-[0_0_30px_#00f2ea] animate-pulse"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full min-h-[110vh] pb-20 pt-24">
        
        {/* Navigation Layers Toggle */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-[#0f0c29] border border-white/20 rounded-full p-1 flex shadow-xl backdrop-blur-md">
            <button 
              onClick={() => setDashboardLayer('NOW')}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                dashboardLayer === 'NOW' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap size={14} /> Now
            </button>
            <button 
              onClick={() => setDashboardLayer('TIMELINE')}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                dashboardLayer === 'TIMELINE' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={14} /> Plan
            </button>
            <button 
              onClick={() => setDashboardLayer('COMPASS')}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                dashboardLayer === 'COMPASS' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <CompassIcon size={14} /> Journey
            </button>
        </div>

        {/* Capacity Indicator */}
        <DailyCapacityMeter capacity={dailyCapacity} />

        {/* --- LAYER 1: NOW MODE --- */}
        {dashboardLayer === 'NOW' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center justify-start pt-32 px-6 pb-48"
          >
            <div className="text-center mb-8">
              <h2 className="text-xl text-gray-400 font-light mb-2">Current Focus</h2>
              <p className="text-sm text-gray-500">One step at a time.</p>
            </div>

            {priorityQuest ? (
              <NowModeCard 
                quest={priorityQuest} 
                onStart={() => onStartSession(priorityQuest)} 
              />
            ) : (
              <div className="text-center py-20 opacity-50">
                 <CheckSquare size={48} className="mx-auto mb-4 text-gray-600" />
                 <h3 className="text-xl font-bold text-gray-400">All Systems Clear</h3>
                 <p className="text-sm text-gray-600">Great work. Take a break.</p>
              </div>
            )}

            <div className="mt-8 mb-12">
               <button 
                 onClick={handleAutoChoice}
                 className="flex flex-col items-center gap-2 group opacity-70 hover:opacity-100 transition-opacity"
               >
                 <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                   <Brain size={24} className="text-gray-400 group-hover:text-primary" />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">Let FocusED Choose</span>
               </button>
            </div>
          </motion.div>
        )}

        {/* --- LAYER 2: TIMELINE MODE --- */}
        {dashboardLayer === 'TIMELINE' && (
           <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="pt-24"
           >
              <TimelineView quests={quests} onStart={onStartSession} />
           </motion.div>
        )}

        {/* --- LAYER 3: COMPASS MODE --- */}
        {dashboardLayer === 'COMPASS' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="w-full min-h-[110vh] flex items-center justify-center relative"
          >
            {/* COMPASS RINGS */}
            <div className="relative w-[800px] h-[800px] flex items-center justify-center scale-75 md:scale-100">
              
              <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5 flex items-center justify-center pointer-events-none">
                <div className="w-[280px] h-[280px] rounded-full border border-dashed border-white/10 animate-spin-slow" style={{ animationDuration: '60s' }} />
              </div>

              {/* Middle Ring - Course Quests */}
              <motion.div 
                className="absolute w-[500px] h-[500px] rounded-full border border-white/10 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 120, ease: "linear", repeat: Infinity }}
              >
                {quests.filter(q => q.type !== 'BRAIN_KICK' && q.type !== 'PERSONAL' && q.type !== 'FITNESS' && q.type !== 'RECOVERY').map((quest, i, arr) => {
                  // Only show first 3 active/available quests to reduce noise
                  const isVisible = i < 3; 
                  return (
                    <QuestNode 
                      key={quest.id} 
                      quest={quest} 
                      radius={250} 
                      angle={(360 / arr.length) * i} 
                      color={getQuestColor(quest)}
                      onSelect={() => { playClick(); setSelectedQuest(quest); }}
                      isHovered={false}
                      isBlurred={!isVisible}
                    />
                  );
                })}
              </motion.div>

              {/* Path Connections (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <circle cx="400" cy="400" r="150" stroke="#00f2ea" strokeWidth="1" fill="none" />
                <path d="M 400 250 L 400 150" stroke="#00f2ea" strokeWidth="2" strokeDasharray="5,5" />
              </svg>

            </div>
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Profile</span>
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
            {activeModal === 'COURSES' && <CoursesModal onClose={() => setActiveModal('NONE')} onOpenHub={onOpenHub} />}
            {activeModal === 'REWARDS' && <RewardsPanel onClose={() => setActiveModal('NONE')} />}
        </AnimatePresence>

      </div>
    </div>
  );
};