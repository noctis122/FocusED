import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface AILoadingProps {
  onComplete: () => void;
}

export const AILoading: React.FC<AILoadingProps> = ({ onComplete }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = [
    "Connecting to Neural Network...",
    "Analyzing Cognitive Patterns...",
    "Calibrating Daily Quests...",
    "Generating Learning Path...",
    "Welcome to FocusED."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(onComplete, 1000);
        return prev;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#030014] flex flex-col items-center justify-center">
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-t-2 border-primary rounded-full w-40 h-40 -m-4 opacity-50"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-b-2 border-secondary rounded-full w-48 h-48 -m-8 opacity-30"
        />
        <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center backdrop-blur-md relative z-10 border border-white/10">
          <Brain size={48} className="text-white animate-pulse" />
        </div>
      </div>

      <motion.div
        key={msgIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="h-8"
      >
        <p className="text-xl font-display font-medium text-primary tracking-widest uppercase">
          {messages[msgIndex]}
        </p>
      </motion.div>
      
      <div className="mt-8 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
