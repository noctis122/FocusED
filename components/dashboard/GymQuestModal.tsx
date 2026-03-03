import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Dumbbell, Clock, Zap, Brain, ChevronRight, Play, CheckCircle, Flame, Trophy } from 'lucide-react';
import { Quest } from '../../types';
import { Button } from '../ui/Button';
import { useDemoContext } from '../../context/DemoContext';
import { useSound } from '../../hooks/useSound';

interface GymQuestModalProps {
  quest: Quest;
  onClose: () => void;
  onStart: () => void;
}

export const GymQuestModal: React.FC<GymQuestModalProps> = ({ quest, onClose, onStart }) => {
  const { generateAIPlan, updateQuestStatus } = useDemoContext();
  const { playClick, playUnlock, playHover } = useSound();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlan, setShowPlan] = useState(!!(quest.subQuests && quest.subQuests.length > 0));
  const [selectedGoal, setSelectedGoal] = useState<'STRENGTH' | 'HYPERTROPHY' | 'ENDURANCE'>('STRENGTH');

  const handleGenerate = async () => {
    playClick();
    setIsGenerating(true);
    await generateAIPlan(quest.id);
    setIsGenerating(false);
    setShowPlan(true);
    playUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0a0a] border border-orange-500/30 rounded-3xl w-full max-w-2xl overflow-hidden relative shadow-[0_0_50px_rgba(249,115,22,0.1)]"
      >
        {/* Header Background */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-orange-900/20 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="p-8 relative z-10">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                <Dumbbell className="text-orange-500 w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Physical Performance</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-gray-400">Energy Restoration</span>
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-1">{quest.title}</h2>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock size={12} /> {quest.duration} min</span>
                  <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-500" /> Med Intensity</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">Close</button>
          </div>

          {/* AI Training Configuration */}
          {!showPlan ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Brain size={16} className="text-orange-500" /> Training Parameters
                </h3>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {['STRENGTH', 'HYPERTROPHY', 'ENDURANCE'].map(goal => (
                    <button
                      key={goal}
                      onClick={() => { playClick(); setSelectedGoal(goal as any); }}
                      className={`py-3 rounded-lg text-xs font-bold border transition-all ${selectedGoal === goal ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-black/20 border-white/10 text-gray-500 hover:border-white/30'}`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>

                <div className="flex items-start gap-4 p-4 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                  <Activity size={20} className="text-orange-500 mt-1 flex-none" />
                  <div>
                    <div className="text-sm font-bold text-orange-400 mb-1">Academic Load Detected</div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      You have a heavy study schedule today. AI recommends a <span className="text-white font-bold">Volume-Focused</span> session to manage CNS fatigue while maintaining momentum.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                className="w-full !border-orange-500/50 hover:!border-orange-500 text-orange-500 hover:text-white"
                variant="outline"
              >
                {isGenerating ? "Generating Plan..." : "Initialize Workout Protocol"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Generated Plan */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <span>Session Roadmap</span>
                  <span>{quest.subQuests?.length} Blocks</span>
                </div>
                
                {quest.subQuests?.map((sq, i) => (
                  <div key={sq.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 group hover:border-orange-500/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-xs font-bold text-gray-500 border border-white/10 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-200">{sq.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{sq.duration} min</span>
                        <span className={`px-1.5 py-0.5 rounded border ${sq.difficulty === 'HARD' ? 'border-red-500/30 text-red-400' : 'border-green-500/30 text-green-400'}`}>{sq.difficulty}</span>
                      </div>
                    </div>
                    {sq.type === 'WORKOUT' && <Flame size={16} className="text-orange-500 opacity-50 group-hover:opacity-100" />}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button onClick={onStart} className="flex-1 !bg-orange-500 !text-black !border-orange-500 hover:!bg-orange-400">
                  Enter Arena <Play size={16} className="ml-2 fill-current" />
                </Button>
                <div className="flex flex-col justify-center items-center px-4">
                   <span className="text-[10px] font-bold text-gray-500 uppercase">keep it up</span>
                   <div className="flex items-center gap-1 text-orange-500 font-bold">
                     <Flame size={14} fill="currentColor" /> on fire
                   </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
