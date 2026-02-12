import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { UserProfile } from '../../types';
import { User, Mail, Lock, Zap, Award, Book, Ghost, Bot, Smile, Shield } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

interface AuthScreenProps {
  onComplete: (data: Partial<UserProfile>) => void;
}

const avatars = [
  { id: 'ghost', icon: Ghost, color: '#ff0055' },
  { id: 'bot', icon: Bot, color: '#00f2ea' },
  { id: 'smile', icon: Smile, color: '#f0db4f' },
  { id: 'shield', icon: Shield, color: '#7000ff' },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const { playClick, playHover } = useSound();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    level: 'University',
    avatarId: 'bot'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    
    if (isLogin) {
      // Sim login
      onComplete({ name: 'Returning User', email: formData.email });
    } else {
      // Start init animation
      setIsInitializing(true);
      setTimeout(() => {
        onComplete({
          name: formData.name,
          email: formData.email,
          level: formData.level as any,
          avatarId: formData.avatarId
        });
      }, 3000);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#030014] text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Zap className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Initializing Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Learning Identity...
            </span>
          </h2>
          <div className="w-64 h-1 bg-white/10 rounded-full mx-auto mt-8 overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] p-4 md:p-0 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-0 bg-[#0f0c29]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 min-h-[600px]">
        
        {/* Left Side - Visual */}
        <div className="relative hidden md:flex flex-col justify-center p-12 bg-black/40 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
              Focus<span className="text-primary">ED</span>
              <br />
              Identity
            </h1>
            <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
              Create your profile to sync quests, track cognitive performance, and unlock academic rewards.
            </p>
            
            <div className="mt-12 flex gap-4">
               <div className="glass-panel p-4 rounded-xl">
                 <Award className="text-yellow-400 mb-2" />
                 <div className="text-xs text-gray-400">Achievements</div>
                 <div className="text-xl font-bold">Syncing...</div>
               </div>
               <div className="glass-panel p-4 rounded-xl">
                 <Zap className="text-primary mb-2" />
                 <div className="text-xs text-gray-400">Daily Energy</div>
                 <div className="text-xl font-bold">Active</div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-end mb-8">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {isLogin ? "Need an account? " : "Already have an account? "}
              <span className="text-primary font-bold">{isLogin ? "Sign Up" : "Login"}</span>
            </button>
          </div>

          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-display font-bold mb-2">{isLogin ? "Welcome Back" : "Initialize System"}</h2>
            <p className="text-gray-500 mb-8">{isLogin ? "Resume your learning journey." : "Configure your student parameters."}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Select Tier</div>
                    {['High School', 'University', 'Self Learning'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({...formData, level})}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${formData.level === level ? 'border-primary bg-primary/10 text-white' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>

                  <div>
                     <div className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1 mb-2">Select Avatar</div>
                     <div className="flex gap-4">
                        {avatars.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setFormData({...formData, avatarId: av.id})}
                            onMouseEnter={playHover}
                            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${formData.avatarId === av.id ? 'border-primary scale-110 shadow-[0_0_15px_rgba(0,242,234,0.3)]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                            style={{ backgroundColor: formData.avatarId === av.id ? `${av.color}20` : undefined }}
                          >
                            <av.icon size={20} style={{ color: formData.avatarId === av.id ? av.color : '#6b7280' }} />
                          </button>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="Access Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Security Code"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                />
              </div>

              <Button className="w-full mt-6" onClick={() => {}}>
                {isLogin ? "Authenticate" : "Create Identity"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
