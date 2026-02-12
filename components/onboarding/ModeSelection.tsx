import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Users, Check, ArrowRight } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

interface ModeSelectionProps {
  onSelect: (mode: 'SOLO' | 'CLASS') => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelect }) => {
  const { playHover, playClick } = useSound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#030014]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Choose Your Path</h2>
        <p className="text-gray-400">How will you use FocusED today?</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Solo Mode Card */}
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          onMouseEnter={playHover}
          onClick={() => {
            playClick();
            onSelect('SOLO');
          }}
          className="group relative cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative h-full bg-[#0f0c29] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden flex flex-col justify-between group-hover:border-primary/50 transition-colors">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Compass className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-3">Solo Explorer</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Build your own learning path. Add custom courses, set personal goals, and challenge yourself with AI-generated quests.
              </p>
              <ul className="space-y-3 mb-8">
                 <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={14} className="text-primary" /> Flexible Schedule</li>
                 <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={14} className="text-primary" /> Personal Analytics</li>
                 <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={14} className="text-primary" /> Custom Skill Trees</li>
              </ul>
            </div>
            
            <div className="flex items-center text-primary font-bold uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
              Select Path <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Class Mode Card */}
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          onMouseEnter={playHover}
          onClick={() => {
            playClick();
            onSelect('CLASS');
          }}
          className="group relative cursor-pointer"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <div className="relative h-full bg-[#0f0c29] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden flex flex-col justify-between group-hover:border-secondary/50 transition-colors">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-3">Class Academy</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Join your university class. Complete teacher-assigned quests, compete in class leaderboards, and follow a structured curriculum.
              </p>
              <ul className="space-y-3 mb-8">
                 <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={14} className="text-secondary" /> Professor Assignments</li>
                 <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={14} className="text-secondary" /> Class Leaderboards</li>
                 <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={14} className="text-secondary" /> Structured Deadlines</li>
              </ul>
            </div>
            
            <div className="flex items-center text-secondary font-bold uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
              Join Academy <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
