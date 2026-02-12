import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, className = '', type = 'button' }) => {
  const { playHover, playClick } = useSound();

  const baseStyles = "relative px-8 py-4 font-display font-bold uppercase tracking-widest text-sm rounded-lg overflow-hidden transition-all duration-300 group";
  
  const variants = {
    primary: "bg-transparent text-white border border-primary/50 hover:border-primary",
    secondary: "bg-transparent text-white border border-secondary/50 hover:border-secondary",
    outline: "bg-transparent text-white/70 border border-white/20 hover:border-white/50"
  };

  const glowColor = variant === 'secondary' ? 'rgba(255, 0, 85, 0.5)' : 'rgba(0, 242, 234, 0.5)';

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={playHover}
      onClick={(e) => {
        playClick();
        if (onClick) onClick();
      }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{
        boxShadow: `0 0 20px ${variant === 'primary' ? 'rgba(0, 242, 234, 0.1)' : 'rgba(255, 0, 85, 0.1)'}`
      }}
    >
      {/* Background Fill Animation */}
      <span className={`absolute inset-0 w-full h-full bg-gradient-to-r ${variant === 'secondary' ? 'from-secondary to-purple-600' : 'from-primary to-blue-600'} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
      
      {/* Glitch Effect Lines */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30 group-hover:w-full group-hover:h-full transition-all duration-500 ease-out" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30 group-hover:w-full group-hover:h-full transition-all duration-500 ease-out" />
      
      <div className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </div>
    </motion.button>
  );
};