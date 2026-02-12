import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Search, Star, Zap, User, 
  Clock, Award, MoreVertical, X, Upload, Brain,
  Sparkles, Layers, Book, CheckCircle, ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useDemoContext } from '../../context/DemoContext';
import { Course } from '../../types';
import { useSound } from '../../hooks/useSound';

// --- ADD TOPIC MODAL ---

interface AddTopicModalProps {
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AddTopicModal: React.FC<AddTopicModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    difficulty: 'Medium',
    examRelevance: false
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { playClick, playUnlock } = useSound();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setIsAnalyzing(true);
    
    // Simulate AI Analysis
    setTimeout(() => {
      playUnlock();
      onAdd(formData);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f0c29] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden relative"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-display font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-primary" /> New Learning Star
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>

        {isAnalyzing ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-6">
               <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
               <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               <Brain className="absolute inset-0 m-auto text-primary animate-pulse" size={32} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">AI Orchestrator Active</h4>
            <p className="text-gray-400 text-sm">Parsing content, generating flashcards, and building quest path...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Topic Title</label>
              <input 
                required
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none text-white"
                placeholder="e.g. Intro to Machine Learning"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none text-white"
                  placeholder="e.g. Computer Science"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                />
              </div>
               <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={e => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none text-white appearance-none"
                >
                  <option className="bg-[#0f0c29]">Easy</option>
                  <option className="bg-[#0f0c29]">Medium</option>
                  <option className="bg-[#0f0c29]">Hard</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer">
               <Upload size={24} className="mb-2" />
               <span className="text-xs font-bold">Upload Syllabus or Notes (PDF)</span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
               <input 
                 type="checkbox" 
                 id="examRel" 
                 checked={formData.examRelevance}
                 onChange={e => setFormData({...formData, examRelevance: e.target.checked})}
                 className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-primary"
               />
               <label htmlFor="examRel" className="text-sm text-gray-300">Generate Exam Prep Material</label>
            </div>

            <div className="pt-4 flex justify-end gap-3">
               <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
               <Button type="submit">Create Topic</Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

// --- CLASS CARD ---

const ClassCard = ({ course, onClick }: { course: Course, onClick: () => void }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group relative bg-[#0f0c29] border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
    >
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: course.color }} />
      <div className="absolute top-0 right-0 p-24 bg-gradient-to-br from-transparent to-white/5 rounded-bl-full group-hover:to-white/10 transition-colors" />
      
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-white/30 transition-colors">
             <BookOpen size={24} style={{ color: course.color }} />
          </div>
          {course.examDate && (
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/20">
              <Clock size={10} /> Exam Soon
            </div>
          )}
        </div>

        <h3 className="text-xl font-display font-bold mb-1 truncate">{course.name}</h3>
        {course.instructor && <p className="text-xs text-gray-500 mb-4">{course.instructor}</p>}
        
        <div className="mb-4">
           <div className="flex justify-between text-xs text-gray-400 mb-1">
             <span>Progress</span>
             <span>{course.progress}%</span>
           </div>
           <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
             <div 
               className="h-full rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_currentColor]"
               style={{ width: `${course.progress}%`, backgroundColor: course.color, color: course.color }} 
             />
           </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-2 rounded-lg">
           <Zap size={12} className="text-yellow-400" />
           <span className="truncate">Next: {course.nextLecture || "Module 1"}</span>
        </div>
      </div>
    </motion.div>
  );
};

// --- COURSE MAP VIEW (Intermediate Step) ---

const CourseMapView = ({ course, onBack, onOpenLecture }: { course: Course, onBack: () => void, onOpenLecture: (id: string) => void }) => {
  return (
    <div className="animate-in fade-in zoom-in duration-500 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowRight className="rotate-180" />
        </button>
        <div>
          <h2 className="text-3xl font-display font-bold">{course.name}</h2>
          <p className="text-gray-400 text-sm">Learning Path Constellation</p>
        </div>
      </div>

      <div className="flex-1 relative bg-[#050510] border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
         {/* Background Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
         
         {/* Path Line */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M 200 300 C 400 300, 400 150, 600 150 S 800 300, 1000 300" stroke={course.color} strokeWidth="2" fill="none" strokeDasharray="5,5" className="opacity-30" />
         </svg>

         {/* Nodes */}
         <div className="absolute top-[300px] left-[200px] -translate-x-1/2 -translate-y-1/2 cursor-pointer group" onClick={() => onOpenLecture('m1')}>
            <div className="w-16 h-16 rounded-full bg-[#0f0c29] border-2 border-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] z-10 relative">
               <CheckCircle size={24} className="text-green-500" />
            </div>
            <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center w-32">
               <div className="text-xs font-bold text-green-500 uppercase mb-1">Completed</div>
               <div className="text-sm font-bold text-white">Intro Lecture</div>
            </div>
         </div>

         <div className="absolute top-[150px] left-[600px] -translate-x-1/2 -translate-y-1/2 cursor-pointer group" onClick={() => onOpenLecture('m1')}>
            <div className="w-20 h-20 rounded-full bg-[#0f0c29] border-2 flex items-center justify-center z-10 relative group-hover:scale-110 transition-transform" style={{ borderColor: course.color, boxShadow: `0 0 30px ${course.color}40` }}>
               <Brain size={32} style={{ color: course.color }} />
            </div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#0f0c29]">1</div>
            
            <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center w-48">
               <div className="text-xs font-bold text-primary uppercase mb-1 flex items-center justify-center gap-1"><Zap size={10}/> Current Topic</div>
               <div className="text-lg font-bold text-white leading-tight">Foundations of Wave Mechanics</div>
               <div className="text-xs text-gray-400 mt-1">1h 20m • High Exam Prob</div>
            </div>
         </div>

         <div className="absolute top-[300px] left-[1000px] -translate-x-1/2 -translate-y-1/2 opacity-50 cursor-not-allowed">
            <div className="w-14 h-14 rounded-full bg-[#0f0c29] border-2 border-gray-700 flex items-center justify-center z-10 relative">
               <Book size={20} className="text-gray-500" />
            </div>
            <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center w-32">
               <div className="text-xs font-bold text-gray-500 uppercase mb-1">Locked</div>
               <div className="text-sm font-bold text-gray-400">Advanced Operators</div>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- MAIN LIBRARY COMPONENT ---

export const LearningLibrary = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
  const { courses, addCourse, setSelectedCourseId } = useDemoContext();
  const [activeTab, setActiveTab] = useState<'INSTITUTIONAL' | 'PERSONAL'>('INSTITUTIONAL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(c => c.type === activeTab);

  const handleAddTopic = (data: any) => {
    addCourse({
      id: `p_${Date.now()}`,
      name: data.title,
      color: '#7000ff', // Default personal color
      type: 'PERSONAL',
      progress: 0,
      description: `Personal study topic: ${data.category}`,
      nextLecture: 'Module 1: Introduction',
      examDate: data.examRelevance ? new Date(Date.now() + 86400000 * 30) : undefined
    });
  };

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleOpenLecture = (lectureId: string) => {
    if (selectedCourse) {
      setSelectedCourseId(selectedCourse.id);
      onNavigate('COURSE_HUB');
    }
  };

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-[#030014] pt-24 px-4 md:px-8 pb-8">
        <CourseMapView 
          course={selectedCourse} 
          onBack={() => setSelectedCourse(null)} 
          onOpenLecture={handleOpenLecture} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] pt-24 px-4 md:px-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AnimatePresence>
        {showAddModal && (
          <AddTopicModal 
            onClose={() => setShowAddModal(false)} 
            onAdd={handleAddTopic} 
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Learning Library</h1>
            <p className="text-gray-400">Centralized command for all academic & personal modules.</p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('INSTITUTIONAL')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'INSTITUTIONAL' ? 'bg-primary/20 text-primary shadow-[0_0_20px_rgba(0,242,234,0.1)]' : 'text-gray-400 hover:text-white'}`}
            >
              <BookOpen size={16} /> Institutional
            </button>
            <button 
              onClick={() => setActiveTab('PERSONAL')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'PERSONAL' ? 'bg-secondary/20 text-secondary shadow-[0_0_20px_rgba(255,0,85,0.1)]' : 'text-gray-400 hover:text-white'}`}
            >
              <User size={16} /> Personal Space
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredCourses.map((course) => (
              <motion.div 
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <ClassCard course={course} onClick={() => handleOpenCourse(course)} />
              </motion.div>
            ))}
            
            {activeTab === 'PERSONAL' && (
              <motion.button 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAddModal(true)}
                className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-500 hover:border-primary/50 hover:text-primary transition-all group min-h-[250px]"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Plus size={32} />
                </div>
                <span className="font-bold">Add New Topic</span>
                <span className="text-xs mt-2">AI-Enhanced Processing</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {filteredCourses.length === 0 && activeTab === 'INSTITUTIONAL' && (
           <div className="text-center py-20 text-gray-500">
             No classes assigned yet. Wait for university sync.
           </div>
        )}

      </div>
    </div>
  );
};
