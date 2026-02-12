import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Zap, Clock, Compass, Target, Activity, Volume2, Monitor, ArrowRight, Check } from 'lucide-react';
import { UserProfile } from '../../types';
import { useSound } from '../../hooks/useSound';

interface ProfileSetupProps {
  onComplete: (data: Partial<UserProfile>) => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { playClick, playHover } = useSound();
  const [data, setData] = useState<{
    personality: string;
    goals: string[];
    energyLevel: 'Light' | 'Moderate' | 'Intensive';
    theme: string;
    soundPack: string;
  }>({
    personality: '',
    goals: [],
    energyLevel: 'Moderate',
    theme: 'Neon Night',
    soundPack: 'Cyber Gaming'
  });

  const nextStep = () => {
    playClick();
    if (step < 3) setStep(step + 1);
    else onComplete(data);
  };

  const steps = [
    { title: "Learning Personality", icon: Compass },
    { title: "Primary Goals", icon: Target },
    { title: "Daily Energy", icon: Zap },
    { title: "System Preferences", icon: Monitor },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#030014]">
      <div className="max-w-4xl w-full">
        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
          {steps.map((s, i) => (
            <div key={i} className={`flex flex-col items-center gap-2 ${i <= step ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${i <= step ? 'bg-[#030014] border-primary text-primary' : 'bg-[#030014] border-gray-600 text-gray-600'}`}>
                <s.icon size={18} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider hidden md:block">{s.title}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#0f0c29]/50 border border-white/10 rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col relative overflow-hidden backdrop-blur-sm">
           <AnimatePresence mode="wait">
             
             {/* Step 1: Personality */}
             {step === 0 && (
               <motion.div
                 key="step1"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex-1"
               >
                 <h2 className="text-3xl font-display font-bold mb-8">What kind of learner are you?</h2>
                 <div className="grid md:grid-cols-2 gap-4">
                   {[
                     { id: 'speed', label: 'Speed Runner', desc: 'Short, intense bursts of focus.', icon: Zap },
                     { id: 'strategist', label: 'Strategist', desc: 'Detailed, long-term planning.', icon: Activity },
                     { id: 'explorer', label: 'Explorer', desc: 'Flexible, curiosity-driven learning.', icon: Compass },
                     { id: 'balanced', label: 'Balanced', desc: 'Adaptive steady approach.', icon: Clock },
                   ].map((p) => (
                     <button
                       key={p.id}
                       onClick={() => setData({ ...data, personality: p.id })}
                       className={`p-6 rounded-2xl border text-left transition-all ${data.personality === p.id ? 'border-primary bg-primary/10' : 'border-white/10 hover:bg-white/5'}`}
                     >
                       <div className="flex items-center gap-3 mb-2">
                         <div className={`p-2 rounded-lg ${data.personality === p.id ? 'bg-primary text-black' : 'bg-white/10 text-gray-400'}`}>
                           <p.icon size={20} />
                         </div>
                         <h3 className="font-bold text-lg">{p.label}</h3>
                       </div>
                       <p className="text-sm text-gray-400">{p.desc}</p>
                     </button>
                   ))}
                 </div>
               </motion.div>
             )}

             {/* Step 2: Goals */}
             {step === 1 && (
               <motion.div
                 key="step2"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex-1"
               >
                 <h2 className="text-3xl font-display font-bold mb-8">Select your primary objectives</h2>
                 <div className="flex flex-wrap gap-3">
                   {['Improve Grades', 'Build Consistency', 'Reduce Stress', 'Ace Exams', 'Master Difficult Topics', 'Daily Discipline', 'Career Prep'].map((goal) => (
                     <button
                       key={goal}
                       onClick={() => {
                         const newGoals = data.goals.includes(goal) 
                           ? data.goals.filter(g => g !== goal)
                           : [...data.goals, goal];
                         setData({ ...data, goals: newGoals });
                       }}
                       className={`px-6 py-3 rounded-full border text-sm font-bold transition-all ${data.goals.includes(goal) ? 'border-secondary bg-secondary/20 text-white shadow-[0_0_15px_rgba(255,0,85,0.3)]' : 'border-white/10 hover:border-white/30 text-gray-400'}`}
                     >
                       {goal}
                     </button>
                   ))}
                 </div>
               </motion.div>
             )}

             {/* Step 3: Energy */}
             {step === 2 && (
               <motion.div
                 key="step3"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex-1 flex flex-col justify-center"
               >
                 <h2 className="text-3xl font-display font-bold mb-4">Target Daily Intensity</h2>
                 <p className="text-gray-400 mb-12">How hard do you want the AI to push you?</p>
                 
                 <div className="relative h-20 bg-white/5 rounded-2xl flex items-center px-4 mb-8">
                   <div className="absolute inset-0 flex">
                     {['Light', 'Moderate', 'Intensive'].map((l, idx) => (
                       <div key={l} className="flex-1 flex items-center justify-center relative z-10">
                         <button
                            onClick={() => setData({ ...data, energyLevel: l as any })}
                            className={`text-sm font-bold uppercase tracking-wider transition-colors ${data.energyLevel === l ? 'text-black' : 'text-gray-500'}`}
                         >
                           {l}
                         </button>
                       </div>
                     ))}
                   </div>
                   {/* Slider Indicator */}
                   <motion.div 
                     className="absolute h-16 rounded-xl bg-primary shadow-[0_0_20px_#00f2ea]"
                     animate={{ 
                       width: '32%', 
                       left: data.energyLevel === 'Light' ? '1%' : data.energyLevel === 'Moderate' ? '34%' : '67%' 
                     }}
                   />
                 </div>
                 
                 <div className="text-center text-sm text-primary font-bold">
                   {data.energyLevel === 'Light' && "Casual pace. Good for maintaining habits."}
                   {data.energyLevel === 'Moderate' && "Balanced workload. The sweet spot for growth."}
                   {data.energyLevel === 'Intensive' && "High performance mode. Maximum XP gain."}
                 </div>
               </motion.div>
             )}

             {/* Step 4: System */}
             {step === 3 && (
               <motion.div
                 key="step4"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="flex-1"
               >
                 <h2 className="text-3xl font-display font-bold mb-8">System Configuration</h2>
                 
                 <div className="space-y-6">
                   <div>
                     <label className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-4 block">UI Theme</label>
                     <div className="grid grid-cols-3 gap-4">
                       {['Neon Night', 'Clean Future', 'Space Academy'].map((theme) => (
                         <button
                           key={theme}
                           onClick={() => setData({ ...data, theme })}
                           className={`p-4 rounded-xl border text-sm font-bold transition-all ${data.theme === theme ? 'border-primary bg-primary/10' : 'border-white/10 hover:bg-white/5'}`}
                         >
                           {theme}
                         </button>
                       ))}
                     </div>
                   </div>
                   
                   <div>
                     <label className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-4 block">Audio Pack</label>
                     <div className="grid grid-cols-3 gap-4">
                       {['Cyber Gaming', 'Calm Ambient', 'Minimal'].map((sound) => (
                         <button
                           key={sound}
                           onClick={() => setData({ ...data, soundPack: sound })}
                           className={`p-4 rounded-xl border text-sm font-bold transition-all ${data.soundPack === sound ? 'border-secondary bg-secondary/10' : 'border-white/10 hover:bg-white/5'}`}
                         >
                           <Volume2 size={16} className="mb-2 mx-auto opacity-50" />
                           {sound}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}

           </AnimatePresence>

           <div className="mt-8 flex justify-end">
             <Button onClick={nextStep} className="w-full md:w-auto">
               {step === 3 ? "Complete Setup" : "Next Step"} <ArrowRight className="ml-2 w-4 h-4" />
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
};