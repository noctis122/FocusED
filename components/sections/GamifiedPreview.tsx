import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Star, Map, Lock } from 'lucide-react';

export const GamifiedPreview: React.FC = () => {
  return (
    <section id="rewards" className="py-24 relative overflow-hidden bg-[#050510]">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Level Up Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-purple-500">
                Intellect
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Forget boring to-do lists. In FocusED, every assignment is a quest, every exam is a boss battle, and consistent study streaks unlock rare cosmetic rewards.
            </p>
            
            <ul className="space-y-4">
              {[
                "Adaptive difficulty that scales with you",
                "Visual skill trees for every subject",
                "Daily 'Brain Kick' starter missions",
                "Unlockable profile aesthetics"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <CheckCircle size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Visual Mockup Container */}
        <div className="relative h-[600px] w-full flex items-center justify-center">
          
          {/* Main Interface Card */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-80 md:w-96 bg-[#0f0c29] border border-white/10 rounded-3xl p-6 shadow-2xl relative z-20"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black" />
                </div>
                <div>
                  <div className="h-2 w-20 bg-white/10 rounded mb-1" />
                  <div className="h-2 w-12 bg-white/10 rounded" />
                </div>
              </div>
              <div className="flex gap-1 text-yellow-400">
                <Star size={16} fill="currentColor" />
                <span className="text-xs font-bold font-display">LVL 12</span>
              </div>
            </div>

            {/* Quest Map Path */}
            <div className="relative h-64 border-l-2 border-dashed border-white/10 ml-5 pl-8 space-y-8">
              {/* Quest Item 1 */}
              <div className="relative">
                <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-green-500 border-4 border-[#0f0c29] flex items-center justify-center">
                  <CheckCircle size={12} className="text-black" />
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-xs text-green-400 mb-1">COMPLETED</div>
                  <div className="text-sm font-bold">Calculus: Limits</div>
                </div>
              </div>

              {/* Quest Item 2 (Active) */}
              <div className="relative">
                <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-primary border-4 border-[#0f0c29] shadow-[0_0_15px_#00f2ea]">
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-primary/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                  <div className="relative z-10">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-primary font-bold">CURRENT QUEST</span>
                      <span>25m left</span>
                    </div>
                    <div className="text-sm font-bold mb-2">Physics: Kinematics Review</div>
                    <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quest Item 3 (Locked) */}
              <div className="relative opacity-50">
                <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-gray-700 border-4 border-[#0f0c29] flex items-center justify-center">
                  <Lock size={10} />
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">LOCKED</div>
                  <div className="text-sm font-bold">Mini-Boss: Weekly Quiz</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-0 md:right-20 glass-panel p-4 rounded-2xl flex items-center gap-4 border border-secondary/30 z-30"
          >
             <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
               <Shield size={20} />
             </div>
             <div>
               <div className="text-xs text-gray-400">Streak Bonus</div>
               <div className="text-lg font-display font-bold text-secondary">+500 XP</div>
             </div>
          </motion.div>

          <motion.div
             animate={{ y: [0, 20, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-20 left-0 md:left-10 glass-panel p-4 rounded-2xl flex items-center gap-4 border border-primary/30 z-10"
           >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Map size={20} />
              </div>
              <div>
                <div className="text-xs text-gray-400">New Region</div>
                <div className="text-md font-display font-bold text-primary">Quantum Mechanics</div>
              </div>
           </motion.div>

        </div>
      </div>
    </section>
  );
};
