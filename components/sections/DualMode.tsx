import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface DualModeProps {
  initialTab?: 'student' | 'uni';
  hideSwitcher?: boolean;
}

export const DualMode: React.FC<DualModeProps> = ({ initialTab = 'student', hideSwitcher = false }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'uni'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <section className="py-32 relative bg-[#030014]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            One Platform. <span className="text-primary">Two Ecosystems.</span>
          </h2>
          
          {!hideSwitcher && (
            <div className="inline-flex p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm relative">
              <button
                onClick={() => setActiveTab('student')}
                className={`relative px-8 py-3 rounded-lg text-sm font-bold transition-all duration-300 z-10 ${activeTab === 'student' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Student Mode
              </button>
              <button
                onClick={() => setActiveTab('uni')}
                className={`relative px-8 py-3 rounded-lg text-sm font-bold transition-all duration-300 z-10 ${activeTab === 'uni' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Institution Mode
              </button>
              
              {/* Sliding Background */}
              <motion.div 
                className="absolute top-1 bottom-1 bg-white/10 rounded-lg border border-white/10"
                initial={false}
                animate={{
                  left: activeTab === 'student' ? '4px' : '50%',
                  width: activeTab === 'student' ? 'calc(50% - 4px)' : 'calc(50% - 4px)',
                  x: activeTab === 'student' ? 0 : 0 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          )}
        </div>

        <div className="relative min-h-[500px] border border-white/10 rounded-3xl overflow-hidden bg-[#080518]">
          <AnimatePresence mode='wait'>
            {activeTab === 'student' ? (
              <motion.div
                key="student"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 h-full"
              >
                <div className="p-12 flex flex-col justify-center relative z-10">
                   <div className="inline-flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase mb-4">
                     <User size={14} /> Personal Learning Companion
                   </div>
                   <h3 className="text-4xl font-display font-bold mb-6">Master Your Own Destiny</h3>
                   <p className="text-gray-400 mb-8 leading-relaxed">
                     Navigate your studies with an AI assistant that adapts to your rhythm. Turn assignments into XP, build streaks, and visualize your knowledge growth.
                   </p>
                   <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-3 text-sm text-gray-300"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Auto-generated flashcards from your notes</li>
                     <li className="flex items-center gap-3 text-sm text-gray-300"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> AI Exam simulator based on your weak points</li>
                     <li className="flex items-center gap-3 text-sm text-gray-300"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Distraction-free Focus Mode</li>
                   </ul>
                   <div>
                    <Button>Start Free <ArrowRight className="ml-2 w-4 h-4" /></Button>
                   </div>
                </div>
                <div className="relative overflow-hidden h-full min-h-[300px] md:min-h-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#080518] to-transparent z-10" />
                  <img 
                    src="https://picsum.photos/800/800?grayscale" 
                    alt="Student Dashboard" 
                    className="w-full h-full object-cover opacity-60 mix-blend-overlay hover:scale-105 transition-transform duration-700"
                  />
                  {/* Decorative Elements */}
                  <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/30 blur-[60px]" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="uni"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 h-full"
              >
                <div className="p-12 flex flex-col justify-center relative z-10 md:order-2">
                   <div className="inline-flex items-center gap-2 text-secondary font-bold tracking-widest text-xs uppercase mb-4">
                     <Building2 size={14} /> Learning Orchestration
                   </div>
                   <h3 className="text-4xl font-display font-bold mb-6">Gamify Your Curriculum</h3>
                   <p className="text-gray-400 mb-8 leading-relaxed">
                     Transform static syllabi into interactive learning journeys. Monitor student engagement in real-time and identify at-risk students before they fall behind.
                   </p>
                   <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-3 text-sm text-gray-300"><div className="w-1.5 h-1.5 bg-secondary rounded-full" /> Instant Course-to-Quest conversion</li>
                     <li className="flex items-center gap-3 text-sm text-gray-300"><div className="w-1.5 h-1.5 bg-secondary rounded-full" /> Automated engagement analytics</li>
                     <li className="flex items-center gap-3 text-sm text-gray-300"><div className="w-1.5 h-1.5 bg-secondary rounded-full" /> Class-wide challenges and leaderboards</li>
                   </ul>
                   <div>
                    <Button variant="secondary">Request Demo <ArrowRight className="ml-2 w-4 h-4" /></Button>
                   </div>
                </div>
                <div className="relative overflow-hidden h-full min-h-[300px] md:min-h-0 md:order-1">
                  <div className="absolute inset-0 bg-gradient-to-l from-[#080518] to-transparent z-10" />
                  <img 
                    src="https://picsum.photos/800/801?grayscale" 
                    alt="University Dashboard" 
                    className="w-full h-full object-cover opacity-60 mix-blend-overlay hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/30 blur-[60px]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};