import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, Rocket, GraduationCap } from 'lucide-react';
import { Button } from './ui/Button';
import { ViewState } from '../types';

interface NavbarProps {
  onLogin: () => void;
  onTeacherDemo?: () => void;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogin, onTeacherDemo, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; view: ViewState }[] = [
    { label: 'Features', view: 'PAGE_FEATURES' },
    { label: 'Student Mode', view: 'PAGE_STUDENT' },
    { label: 'Universities', view: 'PAGE_INSTITUTION' },
    { label: 'Calendar', view: 'CALENDAR' },
    { label: 'Rewards', view: 'PAGE_REWARDS' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#030014]/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 h-20 flex items-center">
        {/* Logo - Left */}
        <div className="flex-none w-48 flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('LANDING')}>
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-50 transition-opacity" />
            <Zap className="w-8 h-8 text-primary relative z-10" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tighter">
            Focus<span className="text-primary">ED</span>
          </span>
        </div>

        {/* Desktop Nav - Center */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.label}
              onClick={() => onNavigate(link.view)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </div>

        {/* Actions - Right */}
        <div className="hidden md:flex flex-none w-48 justify-end items-center gap-4">
          {onTeacherDemo && (
             <button 
               onClick={onTeacherDemo}
               className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-white transition-colors border border-secondary/30 px-3 py-1 rounded-full hover:bg-secondary/10"
             >
               <GraduationCap size={14} /> Teacher View
             </button>
          )}
          <Button className="!py-2 !px-6 text-xs" onClick={onLogin}>Login</Button>
        </div>

        {/* Mobile Toggle (Absolute Right on Mobile) */}
        <div className="md:hidden ml-auto">
          <button 
            className="text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030014] border-b border-white/10"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <button 
                  key={link.label}
                  onClick={() => { setMobileMenuOpen(false); onNavigate(link.view); }}
                  className="text-lg font-medium text-gray-300 hover:text-primary text-left"
                >
                  {link.label}
                </button>
              ))}
               {onTeacherDemo && (
                 <button 
                   onClick={() => { setMobileMenuOpen(false); onTeacherDemo(); }}
                   className="text-lg font-medium text-secondary text-left"
                 >
                   Teacher Demo
                 </button>
               )}
              <Button className="w-full justify-center" onClick={() => {
                setMobileMenuOpen(false);
                onLogin();
              }}>Login</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};