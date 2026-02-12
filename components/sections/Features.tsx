import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Compass, Cpu, Zap, Trophy, PenTool, Layout } from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon, color, delay }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      className="flex-none w-80 md:w-96 glass-panel p-8 rounded-2xl relative group overflow-hidden hover:-translate-y-2 transition-transform duration-300"
    >
      <div 
        className="absolute top-0 right-0 p-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ background: color }}
      />
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/30 transition-colors">
          <Icon size={28} style={{ color }} />
        </div>
        
        <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        
        <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity text-white/70">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          System Active
        </div>
      </div>
    </motion.div>
  );
};

export const Features: React.FC = () => {
  const containerRef = useRef(null);
  
  const features = [
    {
      title: "AI Learning Orchestrator",
      description: "Automatically splits course material into structured subtasks, flashcards, and daily quests.",
      icon: Cpu,
      color: "#00f2ea"
    },
    {
      title: "Study Navigation Compass",
      description: "Replaces boring lists with a journey map. Sessions are destinations, tasks are checkpoints.",
      icon: Compass,
      color: "#7000ff"
    },
    {
      title: "Attention Pulse",
      description: "Immersive focus mode with cognitive rhythm guidance to keep you in the zone.",
      icon: Zap,
      color: "#ff0055"
    },
    {
      title: "Teacher Quest Builder",
      description: "Convert syllabus requirements into engaging student challenges instantly.",
      icon: PenTool,
      color: "#f0db4f"
    },
    {
      title: "Reward Ecosystem",
      description: "Earn profile themes, badges, and avatar customization instead of stress.",
      icon: Trophy,
      color: "#00ff9d"
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
          Core <span className="text-primary">Systems</span>
        </h2>
        <p className="text-gray-400 max-w-xl">
          FocusED is built on advanced learning engines designed to adapt to your cognitive rhythm.
        </p>
      </div>

      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-6 pb-12 px-6 scrollbar-hide snap-x"
        style={{ scrollBehavior: 'smooth' }}
      >
        {features.map((feature, idx) => (
          <FeatureCard key={idx} {...feature} delay={idx} />
        ))}
        {/* Padding for scroll end */}
        <div className="w-6 flex-none" />
      </div>
    </section>
  );
};
