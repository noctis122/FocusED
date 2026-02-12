import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/Button';
import { Brain, FileText, Calendar, Coffee, Award, Zap, BookOpen, Rocket, GraduationCap, User } from 'lucide-react';

interface HeroProps {
  onStudentDemo: () => void;
  onTeacherDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStudentDemo, onTeacherDemo }) => {
  const [isOrdered, setIsOrdered] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  
  useEffect(() => {
    // Trigger "order" animation after mount
    const timer = setTimeout(() => setIsOrdered(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const floatingIcons = [
    { Icon: FileText, color: '#ff0055', x: -200, y: -100, rotate: -45 },
    { Icon: Calendar, color: '#00f2ea', x: 250, y: -150, rotate: 30 },
    { Icon: Coffee, color: '#f0db4f', x: -250, y: 150, rotate: -15 },
    { Icon: Brain, color: '#7000ff', x: 200, y: 100, rotate: 60 },
    { Icon: BookOpen, color: '#00ff9d', x: 0, y: -200, rotate: 15 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 md:pb-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Chaos to Order Visual */}
        <div className="relative h-64 w-full max-w-2xl mx-auto mb-12 hidden md:block">
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ 
                x: item.x * 2, 
                y: item.y * 2, 
                opacity: 0, 
                rotate: item.rotate * 2,
                scale: 0.5 
              }}
              animate={isOrdered ? { 
                x: (index - 2) * 80, // Grid alignment X
                y: 0, 
                opacity: 1, 
                rotate: 0,
                scale: 1,
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
              } : { 
                x: item.x, 
                y: item.y, 
                opacity: 1, 
                rotate: item.rotate,
                scale: 1
              }}
              transition={{ 
                duration: 1.5, 
                type: "spring", 
                stiffness: 40,
                delay: 0.2
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 glass-panel rounded-2xl border border-white/10"
            >
              <item.Icon size={32} style={{ color: item.color }} />
            </motion.div>
          ))}
          
          {/* Central Hub Glow appearing when ordered */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isOrdered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
        >
          Turn Studying Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-pulse-slow">
            Your Greatest Game
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          The AI-powered adaptive platform that evolves your academic chaos into structured, personalized quests.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Button onClick={onStudentDemo}>
            Student Demo <User className="ml-2 w-4 h-4" />
          </Button>
          <Button variant="secondary" onClick={onTeacherDemo}>
            University Demo <GraduationCap className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        {/* Demo Helper Text */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2.5 }}
           className="mt-8 text-sm text-gray-500 bg-white/5 inline-block px-4 py-2 rounded-full border border-white/10"
        >
           Interactive Prototype v1.0 • Select a mode to begin exploration
        </motion.div>
      </div>
      
    </section>
  );
};