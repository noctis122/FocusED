import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, ChevronLeft, Search, PlayCircle, FileText, 
  Layout, MessageSquare, Brain, Send, Zap, Plus, 
  MoreHorizontal, Download, Share2, Maximize2, X,
  ArrowRight, Layers, CheckCircle, Clock, Settings,
  AlertTriangle, Target, GitBranch, ChevronDown, ChevronUp,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useDemoContext } from '../../context/DemoContext';
import { ChatMessage, CourseChapter, CourseMaterial } from '../../types';
import { useSound } from '../../hooks/useSound';

interface CourseHubProps {
  onBack: () => void;
  onNavigate: (view: any) => void;
}

// --- SUB-COMPONENTS ---

const LearningGraph = ({ interactive = false }: { interactive?: boolean }) => {
  const [nodesExpanded, setNodesExpanded] = useState(false);

  return (
    <div className={`w-full bg-[#050510] rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center transition-all ${interactive ? (nodesExpanded ? 'h-96' : 'h-64') : 'h-64'}`}>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
      
      {/* Central Node */}
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
        onClick={() => interactive && setNodesExpanded(!nodesExpanded)}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/20 rounded-full border border-primary flex flex-col items-center justify-center z-20 cursor-pointer hover:shadow-[0_0_30px_#00f2ea] transition-all"
      >
        <Brain size={24} className="text-primary mb-1" />
        <span className="text-[10px] font-bold text-center text-primary leading-tight">Quantum<br/>Mechanics</span>
      </motion.div>

      {/* Child Nodes */}
      <AnimatePresence>
        {(nodesExpanded || !interactive) && (
          <>
            {/* Wave Function */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
              className="absolute left-[15%] top-1/2 -translate-y-1/2 flex flex-col items-center z-10"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full border border-white/20 flex items-center justify-center mb-2 hover:bg-white/10 cursor-pointer">
                <span className="font-serif italic font-bold text-xl">Ψ</span>
              </div>
              <span className="text-[10px] font-bold bg-black/50 px-2 py-1 rounded">Wave Function</span>
            </motion.div>

            {/* Hamiltonian */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              className="absolute right-[15%] top-1/2 -translate-y-1/2 flex flex-col items-center z-10"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full border border-secondary/50 flex items-center justify-center mb-2 hover:bg-secondary/20 cursor-pointer">
                <span className="font-serif font-bold text-xl text-secondary">Ĥ</span>
              </div>
              <span className="text-[10px] font-bold bg-black/50 px-2 py-1 rounded text-secondary">Hamiltonian</span>
            </motion.div>

            {/* Probability Density */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              className="absolute left-1/2 bottom-[10%] -translate-x-1/2 flex flex-col items-center z-10"
            >
              <div className="w-14 h-14 bg-green-500/10 rounded-full border border-green-500/50 flex items-center justify-center mb-2 hover:bg-green-500/20 cursor-pointer">
                <Target size={20} className="text-green-500" />
              </div>
              <span className="text-[10px] font-bold bg-black/50 px-2 py-1 rounded text-green-500">Probability</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path 
           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }}
           d="M 25% 50% L 40% 50%" stroke="#00f2ea" strokeWidth="2" strokeDasharray="4 4" 
        />
        <motion.path 
           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.7 }}
           d="M 60% 50% L 75% 50%" stroke="#ff0055" strokeWidth="2" strokeDasharray="4 4" 
        />
        <motion.path 
           initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.9 }}
           d="M 50% 60% L 50% 80%" stroke="#00ff9d" strokeWidth="2" strokeDasharray="4 4" 
        />
      </svg>
    </div>
  );
};

const FlashcardPreview = ({ count = 3, topic = "Concept" }: { count?: number, topic?: string }) => (
  <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all group">
     <div className="flex justify-between items-start mb-2">
       <div className="text-[10px] font-bold uppercase bg-white/10 px-2 py-0.5 rounded text-gray-400">Flashcard Set</div>
       <div className="text-[10px] text-gray-500">{count} Cards</div>
     </div>
     <div className="h-24 flex items-center justify-center relative perspective-1000">
        <div className="text-center group-hover:scale-105 transition-transform">
           <RefreshCw size={24} className="mx-auto mb-2 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
           <div className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">{topic}</div>
           <div className="text-xs text-gray-500">Click to flip</div>
        </div>
     </div>
  </div>
);

const LectureContent = ({ onAskAI }: { onAskAI: (text: string) => void }) => {
  const [highlighted, setHighlighted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto w-full p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Lecture Header */}
      <div className="mb-8 border-b border-white/10 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-secondary/20 text-secondary border border-secondary/20 flex items-center gap-1">
            <AlertTriangle size={12} /> High Exam Probability
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> 1h 20m</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Introduction to the Schrödinger Equation</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10" />
            <span>Dr. Lina Ben Salem</span>
          </div>
          <span>•</span>
          <span>Week 3 — Foundations</span>
        </div>
      </div>

      {/* Section 1 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-primary">1. Why Classical Physics Fails</h2>
        <div className="prose prose-invert text-gray-300">
          <p className="mb-4">At microscopic scales, classical mechanics cannot accurately describe particle behavior. Experiments such as:</p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>The Photoelectric Effect</li>
            <li>Electron Diffraction</li>
            <li>Blackbody Radiation</li>
          </ul>
          <p>demonstrate that particles behave as both waves and discrete entities. This dual nature requires a new mathematical framework capable of describing probability rather than deterministic position.</p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-primary">2. Wave Function Concept</h2>
        <div className="bg-[#0f0c29] border border-white/10 rounded-xl p-6 mb-6">
          <p className="text-center font-serif text-3xl mb-4 text-white">Ψ(x,t)</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/5 p-3 rounded-lg">
              <span className="font-bold text-gray-400 block mb-1">Ψ</span>
              Probability Amplitude
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <span className="font-bold text-gray-400 block mb-1">|Ψ|²</span>
              Probability Density
            </div>
          </div>
        </div>
        <p className="text-gray-300">The state of a quantum system is described by the wave function. Unlike classical trajectory, the position is probabilistic.</p>
      </section>

      {/* Section 3 - Interactive Equation */}
      <section className="mb-12 relative group" onMouseEnter={() => setHighlighted(true)} onMouseLeave={() => setHighlighted(false)}>
        <h2 className="text-xl font-bold mb-4 text-primary">3. The Time-Dependent Schrödinger Equation</h2>
        
        <div className="relative">
          <div className="bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary rounded-r-xl p-8 mb-6">
            <p className="text-center font-serif text-4xl md:text-5xl font-bold text-white tracking-wider">
              iħ <span className="text-primary">∂Ψ/∂t</span> = <span className="text-secondary">ĤΨ</span>
            </p>
          </div>
          
          {/* Mock Interaction Tooltip */}
          {highlighted && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="absolute -top-10 right-0 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg cursor-pointer flex items-center gap-2 hover:bg-primary transition-colors"
              onClick={() => onAskAI("Explain Schrödinger equation simply")}
            >
              <Brain size={12} /> Ask AI to Explain
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400">
          <div className="text-center"><strong className="block text-white text-lg">i</strong>Imaginary Unit</div>
          <div className="text-center"><strong className="block text-white text-lg">ħ</strong>Reduced Planck</div>
          <div className="text-center"><strong className="block text-secondary text-lg">Ĥ</strong>Hamiltonian</div>
          <div className="text-center"><strong className="block text-primary text-lg">Ψ</strong>Wave Function</div>
        </div>
      </section>

      {/* Section 4 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-primary">4. Physical Interpretation</h2>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="mb-4 text-gray-300">The Hamiltonian operator corresponds to the total energy of the system:</p>
          <div className="flex items-center justify-center gap-4 text-lg font-bold mb-6">
            <span className="text-secondary">Ĥ</span> = <span>Kinetic (T)</span> + <span>Potential (V)</span>
          </div>
          <div className="bg-black/30 p-4 rounded-lg text-center font-mono text-sm text-gray-400">
            Ĥ = −(ħ² / 2m) ∇² + V(x)
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-4 pt-8 border-t border-white/10">
        <Button className="flex-1" onClick={() => onAskAI("Generate flashcards")}>
          <RefreshCw size={16} className="mr-2" /> Create Flashcards
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => onAskAI("Add As Study Task")}>
          <Plus size={16} className="mr-2" /> Add Study Quest
        </Button>
      </div>

    </div>
  );
};

// --- MAIN COMPONENT ---

export const CourseHub: React.FC<CourseHubProps> = ({ onBack, onNavigate }) => {
  const { selectedCourseId, getCourseContent, courses, addQuest, startSession } = useDemoContext();
  const { playClick, playHover, playUnlock } = useSound();
  
  const course = courses.find(c => c.id === selectedCourseId) || courses[0];
  const chapters = getCourseContent(selectedCourseId || 'c1');
  
  const [activeMaterial, setActiveMaterial] = useState<CourseMaterial | null>(chapters[0]?.materials[0] || null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGraphModal, setShowGraphModal] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat based on context
  useEffect(() => {
    if (activeMaterial?.id === 'm1') {
      setChatMessages([
        { id: 'init', sender: 'AI', text: "I've analyzed the lecture content. This topic has a 85% probability of appearing in your midterms. How can I help?", timestamp: new Date() }
      ]);
    } else {
      setChatMessages([
        { id: 'init', sender: 'AI', text: `Welcome to ${course.name}. I'm ready to help you deconstruct complex topics.`, timestamp: new Date() }
      ]);
    }
  }, [activeMaterial, course.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = (text: string = chatInput) => {
    if (!text.trim()) return;
    playClick();
    
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      text: text,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // AI Response Simulation
    setTimeout(() => {
      let aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'AI',
        text: "I'm analyzing that for you...",
        timestamp: new Date()
      };

      const lowerText = text.toLowerCase();
      
      // SPECIFIC SCHRODINGER RESPONSES
      if (activeMaterial?.id === 'm1') {
        if (lowerText.includes('explain') || lowerText.includes('simply')) {
          aiMsg.text = "Think of the Schrödinger equation as the quantum version of F=ma. Instead of telling you exactly where a particle is (like a ball), it tells you how the 'cloud of probability' (wave function) moves and changes shape over time.";
        } else if (lowerText.includes('diagram') || lowerText.includes('graph')) {
          aiMsg.text = "Generating concept map for Wave Mechanics...";
          aiMsg.type = 'GRAPH';
        } else if (lowerText.includes('flashcard')) {
          aiMsg.text = "I've extracted 6 high-yield definitions from the lecture notes.";
          aiMsg.type = 'FLASHCARDS';
        } else if (lowerText.includes('exam')) {
          aiMsg.text = "This topic is critical. Expect questions on: 1) Physical meaning of the wave function, 2) Using the Hamiltonian operator, 3) Solving for infinite potential well.";
        } else if (lowerText.includes('quest') || lowerText.includes('task')) {
          aiMsg.text = "I've created a study plan broken down into manageable chunks.";
          aiMsg.type = 'ACTION';
        } else {
           aiMsg.text = "That's a key insight. Remember that the Hamiltonian represents the Total Energy of the system (Kinetic + Potential).";
        }
      } else {
        // Generic Responses
        if (lowerText.includes('visually') || lowerText.includes('diagram') || lowerText.includes('graph')) {
          aiMsg.text = "Here is a visual breakdown of the topic hierarchy.";
          aiMsg.type = 'GRAPH';
        } else if (lowerText.includes('flashcard')) {
          aiMsg.text = "Flashcard set generated. Would you like to review them now?";
          aiMsg.type = 'FLASHCARDS';
        } else {
          aiMsg.text = "I can help you break this down further. Try asking for a summary or practice questions.";
        }
      }

      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      playUnlock(); 
    }, 1500);
  };

  const handleAction = (type: string) => {
    playClick();
    if (type === 'ADD_TASK') {
       addQuest({
         id: `ai_task_${Date.now()}`,
         title: `Master: Wave Functions`,
         courseId: course.id,
         type: 'AI_REVISION',
         duration: 45,
         difficulty: 'HARD',
         status: 'AVAILABLE',
         aiConfidence: 95,
         xpReward: 250,
         description: "AI Generated quest: Read section summary, review concept graph, and complete flashcards.",
         subQuests: [
           { id: `sq_${Date.now()}_1`, title: 'Read Section Summary', duration: 10, type: 'READING', status: 'AVAILABLE', difficulty: 'EASY' },
           { id: `sq_${Date.now()}_2`, title: 'Review Concept Graph', duration: 15, type: 'REVIEW', status: 'LOCKED', difficulty: 'MEDIUM' },
           { id: `sq_${Date.now()}_3`, title: 'Complete Flashcards', duration: 20, type: 'PRACTICE', status: 'LOCKED', difficulty: 'HARD' }
         ]
       });
       
       const confirmMsg: ChatMessage = {
         id: Date.now().toString(),
         sender: 'AI',
         text: "Quest 'Master: Wave Functions' added to your Command Deck.",
         timestamp: new Date()
       };
       setChatMessages(prev => [...prev, confirmMsg]);
    } else if (type === 'START_FOCUS') {
      const tempId = `quick_focus_${Date.now()}`;
      addQuest({
         id: tempId,
         title: `Deep Dive: ${activeMaterial?.title}`,
         courseId: course.id,
         type: 'SESSION',
         duration: 25,
         difficulty: 'MEDIUM',
         status: 'ACTIVE',
         aiConfidence: 100,
         xpReward: 100
      });
      startSession(tempId);
      onNavigate('FOCUS_MODE');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030014] flex flex-col animate-in fade-in duration-300">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/10 bg-[#030014]/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <ChevronLeft />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${course.color}20` }}>
               <BookOpen size={16} style={{ color: course.color }} />
             </div>
             <div>
               <h1 className="font-bold text-sm md:text-base">{course.name}</h1>
               <div className="flex items-center gap-2 text-xs text-gray-500">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Intelligence Hub Active
               </div>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Brain size={12} className="text-primary" /> AI Analysis Mode
          </div>
          <button className="p-2 text-gray-400 hover:text-white"><Share2 size={18} /></button>
          <button className="p-2 text-gray-400 hover:text-white"><Settings size={18} /></button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: NAVIGATOR */}
        <aside className="w-64 border-r border-white/10 bg-[#050510] flex flex-col shrink-0 hidden md:flex">
           <div className="p-4 border-b border-white/10">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
               <input type="text" placeholder="Search Materials..." className="w-full bg-[#0f0c29] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50" />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {chapters.map(chapter => (
                <div key={chapter.id}>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">{chapter.title}</div>
                  <div className="space-y-1">
                    {chapter.materials.map(mat => (
                      <button
                        key={mat.id}
                        onClick={() => setActiveMaterial(mat)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${activeMaterial?.id === mat.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                      >
                         <div className={`w-6 h-6 rounded flex items-center justify-center ${mat.completed ? 'text-green-500 bg-green-500/10' : 'text-gray-500 bg-white/5 group-hover:bg-white/10'}`}>
                           {mat.type === 'VIDEO' && <PlayCircle size={14} />}
                           {mat.type === 'READING' && <FileText size={14} />}
                           {mat.type === 'SLIDES' && <Layout size={14} />}
                           {mat.type === 'QUIZ' && <Zap size={14} />}
                         </div>
                         <span className="truncate">{mat.title}</span>
                         {mat.completed && <CheckCircle size={12} className="ml-auto text-green-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
           </div>
        </aside>

        {/* CENTER: CONTENT */}
        <main className="flex-1 bg-[#030014] relative overflow-y-auto flex flex-col">
           {activeMaterial ? (
             activeMaterial.content === 'FULL_LECTURE_MOCK' ? (
                <LectureContent onAskAI={handleSendMessage} />
             ) : (
                <div className="max-w-3xl mx-auto w-full p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-white/10 text-gray-300">{activeMaterial.type}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {activeMaterial.duration} min read</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">{activeMaterial.title}</h1>
                    
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="space-y-6">
                          <p className="leading-relaxed text-gray-300">
                            {activeMaterial.content || "Content placeholder. Select the 'Intro to Schrödinger Equation' lecture for the full interactive demo experience."}
                          </p>
                          <div className="bg-[#0f0c29] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] text-gray-500">
                              {activeMaterial.type === 'VIDEO' ? (
                                <PlayCircle size={48} className="mb-4 text-white/20" />
                              ) : (
                                <FileText size={48} className="mb-4 text-white/20" />
                              )}
                              <span>{activeMaterial.type} Content Placeholder</span>
                          </div>
                        </div>
                    </div>
                </div>
             )
           ) : (
             <div className="flex-1 flex items-center justify-center text-gray-500">
               Select a material to view content.
             </div>
           )}
        </main>

        {/* RIGHT: AI ASSISTANT */}
        <aside className="w-80 md:w-96 border-l border-white/10 bg-[#050510] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0f0c29]/50">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="font-bold text-sm">Learning Assistant</span>
             </div>
             <Button variant="outline" className="!px-2 !py-1 !text-[10px] h-auto" onClick={() => setChatMessages([])}>Clear Chat</Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {chatMessages.map(msg => (
               <div key={msg.id} className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'USER' 
                      ? 'bg-primary/20 text-primary-50 rounded-tr-none border border-primary/20' 
                      : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10'
                  }`}>
                    {msg.text}
                    
                    {/* Visual Attachments */}
                    {msg.type === 'GRAPH' && (
                      <div className="mt-3">
                        <LearningGraph interactive={true} />
                        <div className="flex gap-2 mt-2">
                           <button onClick={() => handleAction('START_FOCUS')} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded py-1.5 text-xs text-center transition-colors">Study Graph</button>
                           <button className="p-1.5 hover:bg-white/10 rounded border border-white/10"><Maximize2 size={14}/></button>
                        </div>
                      </div>
                    )}
                    
                    {msg.type === 'FLASHCARDS' && (
                      <div className="mt-3">
                         <FlashcardPreview count={6} topic="Quantum Basics" />
                         <button onClick={() => handleAction('ADD_TASK')} className="w-full mt-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 rounded py-1.5 text-xs font-bold transition-colors">
                           Add to Tasks
                         </button>
                      </div>
                    )}

                    {msg.type === 'ACTION' && (
                      <div className="mt-3 space-y-2">
                         <button onClick={() => handleAction('ADD_TASK')} className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs transition-colors">
                           <span><Plus size={10} className="inline mr-2"/>Create "Wave Function" Quest</span>
                           <ArrowRight size={10}/>
                         </button>
                         <button onClick={() => handleAction('START_FOCUS')} className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs transition-colors">
                           <span><Zap size={10} className="inline mr-2"/>Start "Particle in Box" Session</span>
                           <ArrowRight size={10}/>
                         </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-600 mt-1 px-2">
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
               </div>
             ))}
             
             {isTyping && (
               <div className="flex items-start">
                  <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center border border-white/10">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 bg-[#0f0c29]/50">
             {/* Suggestions */}
             {chatMessages.length < 3 && activeMaterial?.id === 'm1' ? (
               <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                 {['Explain equation', 'Create diagram', 'Generate flashcards', 'Exam probability'].map(prompt => (
                   <button 
                     key={prompt}
                     onClick={() => handleSendMessage(prompt)}
                     className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                   >
                     {prompt}
                   </button>
                 ))}
               </div>
             ) : null}
             
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Ask about this topic..." 
                 className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:border-primary focus:outline-none text-white"
                 value={chatInput}
                 onChange={(e) => setChatInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
               />
               <button 
                 onClick={() => handleSendMessage()}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary hover:text-black transition-all"
               >
                 <Send size={16} />
               </button>
             </div>
          </div>
        </aside>

      </div>
    </div>
  );
};