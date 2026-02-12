import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, BarChart2, Calendar, Settings, Plus, 
  Upload, Zap, Brain, ChevronRight, MoreHorizontal, 
  CheckCircle, AlertTriangle, FileText, Search, Play, GripVertical, Trash2,
  RefreshCw, Layout, X
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ClassGroup, StudentMetric, TeacherQuestModule } from '../../types';
import { useDemoContext } from '../../context/DemoContext';

// --- SUB-COMPONENTS ---

const CreateClassModal = ({ onClose }: { onClose: () => void }) => {
  const { addClass } = useDemoContext();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    color: '#00f2ea'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClass({
      id: `c_${Date.now()}`,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      color: formData.color,
      studentCount: 0,
      activeQuests: 0,
      engagementScore: 100
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f0c29] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-display font-bold">Create New Class</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Class Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none"
              placeholder="e.g. Linear Algebra"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Course Code</label>
              <input 
                required
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none"
                placeholder="e.g. MAT204"
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Theme Color</label>
              <div className="flex gap-2 mt-2">
                {['#00f2ea', '#ff0055', '#f0db4f', '#7000ff', '#00ff9d'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, color})}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none h-24"
              placeholder="Brief overview of the curriculum..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
             <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
             <Button type="submit">Create Class</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ClassCard: React.FC<{ classData: ClassGroup; onClick: () => void }> = ({ classData, onClick }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="group bg-[#0f0c29] border border-white/10 rounded-2xl p-6 cursor-pointer relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-24 bg-gradient-to-br from-transparent to-white/5 rounded-bl-full group-hover:to-white/10 transition-colors" />
    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: classData.color }} />
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">{classData.name}</h3>
          <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">{classData.code}</span>
        </div>
        <div className="bg-white/5 p-2 rounded-lg group-hover:bg-white/10 transition-colors">
          <MoreHorizontal size={16} className="text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-xs text-gray-500 uppercase font-bold">Students</div>
          <div className="text-lg font-bold flex items-center gap-2">
            <Users size={16} className="text-gray-400" /> {classData.studentCount}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase font-bold">Engagement</div>
          <div className={`text-lg font-bold flex items-center gap-2 ${classData.engagementScore > 80 ? 'text-green-400' : classData.engagementScore > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            <BarChart2 size={16} /> {classData.engagementScore}%
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-4">
        <span>Active Quests: <span className="text-white font-bold">{classData.activeQuests}</span></span>
        <span>Deadline: <span className="text-secondary font-bold">{classData.nextDeadline || 'None'}</span></span>
      </div>
    </div>
  </motion.div>
);

const QuestBuilder = ({ onBack }: { onBack: () => void }) => {
  const { teacherModules, setTeacherModules, teacherBuilderState, setTeacherBuilderState } = useDemoContext();
  const { isGenerating, showAIPreview } = teacherBuilderState;

  const handleFileUpload = () => {
    setTeacherBuilderState({ ...teacherBuilderState, isGenerating: true });
    setTimeout(() => {
      setTeacherBuilderState({ isGenerating: false, showAIPreview: true });
    }, 2500);
  };

  const acceptAIContent = () => {
    setTeacherModules([
      ...teacherModules,
      { id: 'ai1', type: 'QUIZ', title: 'Auto-Generated Quiz', duration: 15, difficulty: 'MEDIUM' },
      { id: 'ai2', type: 'FLASHCARDS', title: 'Key Concept Cards', duration: 10, difficulty: 'EASY' },
      { id: 'ai3', type: 'CHECKPOINT', title: 'Mid-Module Review', duration: 20, difficulty: 'HARD' },
    ]);
    setTeacherBuilderState({ ...teacherBuilderState, showAIPreview: false });
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ChevronRight className="rotate-180" />
          </button>
          <div>
            <h2 className="text-3xl font-display font-bold">Quest Builder</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold">AI ACTIVE</span>
              <span>Drafting: Week 5 - Algorithmic Complexity</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => {}}>Save Draft</Button>
          <Button onClick={() => {}}>Publish Quest</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* Left: Sources & AI */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="bg-[#0f0c29] border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FileText size={18} className="text-gray-400" /> Source Material
            </h3>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer group" onClick={handleFileUpload}>
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload size={20} className="text-gray-400 group-hover:text-primary" />
              </div>
              <p className="text-sm text-gray-400 font-bold">Drop Syllabus or Slides</p>
              <p className="text-xs text-gray-500 mt-1">PDF, PPTX, DOCX supported</p>
            </div>
          </div>

          <div className="bg-[#0f0c29] border border-white/10 rounded-2xl p-6 flex-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Brain size={18} className="text-primary" /> AI Orchestrator
            </h3>
            
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-primary font-bold animate-pulse">Analyzing Content Structure...</p>
                <p className="text-xs text-gray-500 mt-2">Extracting key concepts and generating quiz metrics.</p>
              </div>
            ) : showAIPreview ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-primary uppercase">Generated Content</span>
                    <span className="bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full">3 Items</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={12} className="text-primary" /> 5-Question Quiz</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={12} className="text-primary" /> 12 Flashcards</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={12} className="text-primary" /> Review Checkpoint</li>
                  </ul>
                  <div className="flex gap-2">
                    <button onClick={acceptAIContent} className="flex-1 bg-primary text-black font-bold py-2 rounded-lg text-xs hover:bg-white transition-colors">Accept All</button>
                    <button onClick={() => setTeacherBuilderState({ ...teacherBuilderState, showAIPreview: false })} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5"><Trash2 size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">
                Upload content to enable AI generation features.
              </div>
            )}
            
            <div className="mt-auto pt-4 border-t border-white/5">
               <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                   <Zap size={14} className="text-secondary" />
                 </div>
                 <div className="text-left">
                   <div className="text-xs font-bold text-white">Generate Revision</div>
                   <div className="text-[10px] text-gray-400">Create review based on weak topics</div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Timeline Editor */}
        <div className="col-span-8 bg-[#0f0c29] border border-white/10 rounded-2xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" /> Learning Timeline
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
               <span>Total Duration: 1h 45m</span>
               <span className="w-1 h-1 bg-gray-600 rounded-full" />
               <span>Avg Difficulty: Medium</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 relative">
             <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
             
             {teacherModules.map((mod, idx) => (
               <motion.div 
                 key={mod.id}
                 layout
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="relative pl-12 group"
               >
                 <div className="absolute left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0f0c29] border-2 border-primary z-10 group-hover:scale-125 transition-transform" />
                 
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-primary/50 transition-colors cursor-grab active:cursor-grabbing">
                   <GripVertical className="text-gray-600" size={16} />
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mod.type === 'QUIZ' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                     {mod.type === 'VIDEO' && <Play size={18} />}
                     {mod.type === 'READING' && <FileText size={18} />}
                     {mod.type === 'QUIZ' && <Zap size={18} />}
                     {mod.type === 'FLASHCARDS' && <RefreshCw size={18} />}
                     {mod.type === 'CHECKPOINT' && <AlertTriangle size={18} />}
                   </div>
                   
                   <div className="flex-1">
                     <div className="flex items-center gap-2">
                       <h4 className="font-bold">{mod.title}</h4>
                       <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                         mod.difficulty === 'HARD' ? 'border-red-500/30 text-red-400' :
                         mod.difficulty === 'MEDIUM' ? 'border-yellow-500/30 text-yellow-400' :
                         'border-green-500/30 text-green-400'
                       }`}>{mod.difficulty}</span>
                     </div>
                     <div className="text-xs text-gray-500 mt-1">{mod.duration} min • {mod.type}</div>
                   </div>

                   <button onClick={() => setTeacherModules(teacherModules.filter(m => m.id !== mod.id))} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 hover:text-red-400 rounded transition-all">
                     <Trash2 size={16} />
                   </button>
                 </div>
               </motion.div>
             ))}
             
             <motion.button 
               whileHover={{ scale: 1.02 }}
               className="w-full ml-12 border-2 border-dashed border-white/10 rounded-xl p-4 text-center text-gray-500 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
             >
               <Plus size={16} /> Add Module
             </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TeacherDashboard: React.FC = () => {
  const { teacherClasses, studentMetrics } = useDemoContext();
  const [view, setView] = useState<'OVERVIEW' | 'CLASSES' | 'CLASS_DETAIL' | 'QUEST_BUILDER' | 'ANALYTICS' | 'SETTINGS'>('OVERVIEW');
  const [selectedClass, setSelectedClass] = useState<ClassGroup | null>(null);
  const [showCreateClass, setShowCreateClass] = useState(false);

  const handleClassSelect = (cls: ClassGroup) => {
    setSelectedClass(cls);
    setView('CLASS_DETAIL');
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white flex pt-20">
      
      <AnimatePresence>
        {showCreateClass && <CreateClassModal onClose={() => setShowCreateClass(false)} />}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#050510] flex flex-col fixed h-[calc(100vh-80px)] top-20 z-20">
        <div className="p-6">
          <div className="bg-gradient-to-r from-secondary/20 to-purple-500/20 border border-white/10 rounded-xl p-4 mb-8">
            <h3 className="font-bold text-sm mb-1">Teacher Pro</h3>
            <p className="text-xs text-gray-400">Dr. Sarah Connor</p>
          </div>
          
          <nav className="space-y-2">
            {[
              { label: 'Overview', icon: Layout, id: 'OVERVIEW' },
              { label: 'My Classes', icon: BookOpen, id: 'CLASSES' },
              { label: 'Quest Builder', icon: Zap, id: 'QUEST_BUILDER' },
              { label: 'Analytics', icon: BarChart2, id: 'ANALYTICS' },
              { label: 'Settings', icon: Settings, id: 'SETTINGS' }
            ].map((item) => (
              <button 
                key={item.label}
                onClick={() => setView(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                   (view === item.id || (item.id === 'CLASSES' && view === 'CLASS_DETAIL')) 
                   ? 'bg-primary/10 text-primary border border-primary/20' 
                   : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-white/10">
          <div className="bg-[#0f0c29] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
               <Brain size={16} className="text-primary" />
               <span className="text-xs font-bold uppercase text-primary">AI Insights</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              CS101 engagement dropped by 12% this week. Consider a reinforcement quest.
            </p>
            <button className="mt-3 text-xs font-bold text-white hover:text-primary transition-colors flex items-center gap-1">
              Generate Solution <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-[calc(100vh-80px)]">
        {/* We use a simple div here instead of AnimatePresence to ensure stability of the dashboard content */}
        <div className="relative">
          
          {/* OVERVIEW / DASHBOARD */}
          {view === 'OVERVIEW' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h1 className="text-4xl font-display font-bold mb-2">Command Center</h1>
                  <p className="text-gray-400">Manage your digital classroom ecosystem.</p>
                </div>
                <Button onClick={() => setView('QUEST_BUILDER')}>
                  <Plus size={16} className="mr-2" /> New Quest
                </Button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-6 mb-12">
                {[
                  { label: 'Active Students', val: '287', color: 'text-white' },
                  { label: 'Avg Engagement', val: '84%', color: 'text-green-400' },
                  { label: 'Quests Completed', val: '1.2k', color: 'text-primary' },
                  { label: 'Pending Reviews', val: '24', color: 'text-yellow-400' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0f0c29] border border-white/10 p-6 rounded-2xl">
                    <div className="text-gray-500 text-xs font-bold uppercase mb-2">{stat.label}</div>
                    <div className={`text-3xl font-display font-bold ${stat.color}`}>{stat.val}</div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold mb-6">Active Classes</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {teacherClasses.map(cls => (
                  <ClassCard key={cls.id} classData={cls} onClick={() => handleClassSelect(cls)} />
                ))}
                <button 
                  onClick={() => setShowCreateClass(true)}
                  className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-500 hover:border-primary/50 hover:text-primary transition-all group min-h-[250px]"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Plus size={32} />
                  </div>
                  <span className="font-bold">Create New Class</span>
                </button>
              </div>

            </motion.div>
          )}

          {/* CLASSES LIST VIEW */}
          {view === 'CLASSES' && (
            <motion.div 
              key="classes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <h1 className="text-4xl font-display font-bold mb-8">My Classes</h1>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacherClasses.map(cls => (
                  <ClassCard key={cls.id} classData={cls} onClick={() => handleClassSelect(cls)} />
                ))}
                 <button 
                   onClick={() => setShowCreateClass(true)}
                   className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-500 hover:border-primary/50 hover:text-primary transition-all group min-h-[250px]"
                 >
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Plus size={32} />
                  </div>
                  <span className="font-bold">Create New Class</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ANALYTICS VIEW */}
          {view === 'ANALYTICS' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
               <h1 className="text-4xl font-display font-bold mb-8">Global Analytics</h1>
               <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="bg-[#0f0c29] border border-white/10 rounded-2xl p-8">
                    <h3 className="font-bold mb-4">Student Engagement Trends</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                       {[65, 70, 68, 74, 82, 80, 85, 88, 84, 90].map((h, i) => (
                         <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group">
                            <div className="absolute bottom-0 w-full bg-primary transition-all duration-1000" style={{ height: `${h}%` }} />
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-[#0f0c29] border border-white/10 rounded-2xl p-8">
                    <h3 className="font-bold mb-4">Quest Completion Rates</h3>
                    <div className="space-y-4">
                       {[
                         { label: 'Weekly Quizzes', val: 92 },
                         { label: 'Reading Assignments', val: 78 },
                         { label: 'Video Lectures', val: 85 },
                         { label: 'Peer Reviews', val: 64 }
                       ].map((item, i) => (
                         <div key={i}>
                           <div className="flex justify-between text-sm mb-1">
                             <span>{item.label}</span>
                             <span>{item.val}%</span>
                           </div>
                           <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-secondary" style={{ width: `${item.val}%` }} />
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>
            </motion.div>
          )}

          {/* SETTINGS VIEW */}
          {view === 'SETTINGS' && (
             <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
               <h1 className="text-4xl font-display font-bold mb-8">Settings</h1>
               <div className="bg-[#0f0c29] border border-white/10 rounded-2xl p-8 space-y-6">
                 <div>
                   <label className="block text-sm font-bold mb-2 text-gray-400">Display Name</label>
                   <input type="text" value="Dr. Sarah Connor" readOnly className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold mb-2 text-gray-400">Email Notifications</label>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-pointer border border-primary/50">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full" />
                      </div>
                      <span className="text-sm">Enabled for high priority alerts</span>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-bold mb-2 text-gray-400">AI Assistance Level</label>
                   <div className="grid grid-cols-3 gap-4">
                      <button className="p-3 border border-primary bg-primary/10 rounded-lg text-sm font-bold">Proactive</button>
                      <button className="p-3 border border-white/10 bg-white/5 rounded-lg text-sm text-gray-400">Balanced</button>
                      <button className="p-3 border border-white/10 bg-white/5 rounded-lg text-sm text-gray-400">Minimal</button>
                   </div>
                 </div>
               </div>
            </motion.div>
          )}

          {/* CLASS DETAIL VIEW */}
          {view === 'CLASS_DETAIL' && selectedClass && (
            <motion.div
              key="class_detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-6xl mx-auto"
            >
              <button onClick={() => setView('OVERVIEW')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2">
                <ChevronRight className="rotate-180" size={16} /> Back to Dashboard
              </button>

              <div className="bg-[#0f0c29] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-transparent to-white/5 rounded-bl-full" />
                <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: selectedClass.color }} />
                
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-display font-bold mb-2">{selectedClass.name}</h1>
                    <p className="text-gray-400 max-w-xl">{selectedClass.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">Settings</Button>
                    <Button onClick={() => setView('QUEST_BUILDER')}>Generate Quest</Button>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Students List */}
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Student Performance</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                      <input type="text" placeholder="Search student..." className="bg-[#0f0c29] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-primary focus:outline-none" />
                    </div>
                  </div>

                  <div className="bg-[#0f0c29] border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-xs font-bold uppercase text-gray-500">
                        <tr>
                          <th className="p-4">Student</th>
                          <th className="p-4">Engagement</th>
                          <th className="p-4">Quests</th>
                          <th className="p-4">Risk Level</th>
                          <th className="p-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {studentMetrics.map(s => (
                          <tr key={s.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold">{s.name}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary" style={{ width: `${s.engagement}%` }} />
                                </div>
                                <span className="text-xs">{s.engagement}%</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-400">{s.completedQuests}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                s.riskLevel === 'HIGH' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                                s.riskLevel === 'MEDIUM' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                                'border-green-500/30 text-green-400 bg-green-500/10'
                              }`}>
                                {s.riskLevel}
                              </span>
                            </td>
                            <td className="p-4">
                              <button className="text-gray-500 hover:text-white"><MoreHorizontal size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Engagement Chart (Mock) */}
                <div>
                   <h3 className="text-xl font-bold mb-6">Activity Heatmap</h3>
                   <div className="bg-[#0f0c29] border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
                     <div className="flex-1 flex items-end gap-2 px-2">
                        {[40, 60, 35, 80, 70, 90, 85, 40, 50, 75].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative group">
                            <div className="absolute bottom-0 left-0 w-full bg-primary rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }} />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {h}%
                            </div>
                          </div>
                        ))}
                     </div>
                     <div className="border-t border-white/10 mt-4 pt-4 flex justify-between text-xs text-gray-500">
                        <span>Week 1</span>
                        <span>Week 10</span>
                     </div>
                   </div>

                   <div className="mt-6 bg-[#0f0c29] border border-white/10 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <AlertTriangle size={20} className="text-yellow-500" />
                        </div>
                        <div>
                          <div className="font-bold text-sm mb-1">Attention Drop Detected</div>
                          <p className="text-xs text-gray-400 mb-3">Engagement is 15% lower on "Quantum Mechanics" module.</p>
                          <button className="text-xs text-primary font-bold hover:underline">View Analysis</button>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* QUEST BUILDER VIEW */}
          {view === 'QUEST_BUILDER' && (
            <motion.div 
              key="builder"
              className="h-full flex flex-col"
            >
              <QuestBuilder onBack={() => setView('OVERVIEW')} />
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
};