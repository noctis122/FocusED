import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Brain, TrendingUp, AlertTriangle, CheckCircle, 
  BarChart2, Calendar, Target, Clock, ArrowLeft, Loader2, Play, Check, X
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useDemoContext } from '../../context/DemoContext';
import { AnimatePresence, motion } from 'framer-motion';

interface ExamPrepProps {
  onBack: () => void;
}

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "A particle moves with a velocity v(t) = 3t² - 2t. What is its acceleration at t = 3s?",
    options: ["12 m/s²", "16 m/s²", "18 m/s²", "24 m/s²"],
    correct: 1 // 16 m/s² (a = 6t - 2 -> 6(3)-2 = 16)
  },
  {
    id: 2,
    question: "Which law of thermodynamics states that entropy of an isolated system always increases?",
    options: ["Zeroth Law", "First Law", "Second Law", "Third Law"],
    correct: 2
  },
  {
    id: 3,
    question: "In the context of Renaissance Art, 'sfumato' refers to:",
    options: ["Use of geometric perspective", "Soft, smoky blending of tones", "Dramatic contrast of light/dark", "Religious symbolism"],
    correct: 1
  }
];

export const ExamPrep: React.FC<ExamPrepProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MOCK' | 'INSIGHTS'>('OVERVIEW');
  const [mockExamState, setMockExamState] = useState<'IDLE' | 'GENERATING' | 'READY' | 'ACTIVE' | 'REVIEW'>('IDLE');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(MOCK_QUESTIONS.length).fill(-1));
  const [examScore, setExamScore] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const { addQuest } = useDemoContext();

  // Clear toast after 3s
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleGenerateExam = () => {
    setMockExamState('GENERATING');
    // Simulate AI delay
    setTimeout(() => {
      setMockExamState('READY');
    }, 2500);
  };

  const startExam = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(MOCK_QUESTIONS.length).fill(-1));
    setMockExamState('ACTIVE');
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const submitExam = () => {
    let score = 0;
    selectedAnswers.forEach((ans, idx) => {
      if (ans === MOCK_QUESTIONS[idx].correct) score++;
    });
    setExamScore(score);
    setMockExamState('REVIEW');
  };

  const handleStartRemedial = (topic: string) => {
    const newId = `remedial_${Date.now()}`;
    addQuest({
      id: newId,
      title: `Remedial: ${topic}`,
      courseId: 'SYSTEM',
      type: 'AI_REVISION',
      duration: 20,
      difficulty: 'MEDIUM',
      status: 'AVAILABLE',
      aiConfidence: 85,
      xpReward: 100,
      description: `AI-Generated review session targeting gaps in ${topic}.`
    });
    setToast(`Remedial Quest for ${topic} added to Dashboard`);
  };

  const handleScheduleShift = () => {
    setToast("Schedule Updated. +2hrs Physics added.");
  };

  return (
    <div className="min-h-screen bg-[#030014] p-6 pt-24 text-white relative z-10">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0f0c29] border border-primary/50 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[60]"
          >
            <CheckCircle size={16} className="text-primary" />
            <span className="font-bold text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-display font-bold">Exam Engine</h1>
              <p className="text-gray-400 text-sm">AI-Powered Preparation & Strategy</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['OVERVIEW', 'MOCK', 'INSIGHTS'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab 
                    ? 'bg-primary/20 text-primary border border-primary/50' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="relative min-h-[500px]">
          {activeTab === 'OVERVIEW' && (
            <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Timeline Card */}
              <div className="md:col-span-2 bg-[#0f0c29] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-secondary/5 rounded-bl-full" />
                <div className="relative z-10">
                  <div className="flex justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="text-secondary" size={20} /> Upcoming Exams
                    </h3>
                    <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded">Fall Semester</span>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { title: "Quantum Physics Midterm", date: "Oct 24", daysLeft: 5, confidence: 78, color: '#00f2ea' },
                      { title: "Calculus Final", date: "Nov 12", daysLeft: 24, confidence: 92, color: '#ff0055' },
                      { title: "Art History Essay", date: "Nov 15", daysLeft: 27, confidence: 65, color: '#f0db4f' },
                    ].map((exam, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-white/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg flex items-col items-center justify-center bg-black/40 border border-white/10">
                            <span className="text-xs font-bold text-gray-400 uppercase">{exam.date.split(' ')[0]}</span>
                            <span className="text-lg font-bold">{exam.date.split(' ')[1]}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{exam.title}</h4>
                            <span className={`text-xs ${exam.daysLeft < 7 ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                              {exam.daysLeft} days remaining
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 uppercase font-bold mb-1">Confidence</div>
                          <div className="text-xl font-display font-bold" style={{ color: exam.color }}>{exam.confidence}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Insight Card */}
              <div className="bg-gradient-to-b from-[#0f0c29] to-[#050510] border border-white/10 rounded-2xl p-8 flex flex-col">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Brain className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Strategy Update</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Based on your recent quizzes, your grasp of <strong>Vector Calculus</strong> has dropped by 12%. I recommend shifting 2 hours from Art History to Physics this week.
                </p>
                
                <div className="mt-auto space-y-3">
                  <button onClick={handleScheduleShift} className="w-full py-3 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm font-bold hover:bg-primary/20 transition-all">
                    Accept Schedule Shift
                  </button>
                  <button className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-sm font-bold hover:text-white transition-all">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'MOCK' && (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center animate-in fade-in zoom-in duration-500 relative">
              
              {mockExamState === 'IDLE' && (
                <>
                  <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Target size={40} className="text-secondary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-4">Exam Simulator</h2>
                  <p className="text-gray-400 max-w-md mb-8">
                    Generate a mock exam based on your weak points. The AI will prioritize topics you've struggled with in the last 2 weeks.
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-md w-full mb-8">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left">
                      <div className="text-xs text-gray-500 uppercase font-bold">Duration</div>
                      <div className="text-lg font-bold">45 Mins</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left">
                      <div className="text-xs text-gray-500 uppercase font-bold">Difficulty</div>
                      <div className="text-lg font-bold text-red-400">Adaptive Hard</div>
                    </div>
                  </div>
                  <Button onClick={handleGenerateExam}>Generate Mock Exam</Button>
                </>
              )}

              {mockExamState === 'GENERATING' && (
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <Brain className="absolute inset-0 m-auto text-primary animate-pulse" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Analyzing Knowledge Graph...</h3>
                  <p className="text-gray-500">Extracting probability vectors from past mistakes.</p>
                </div>
              )}

              {mockExamState === 'READY' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-md bg-[#0f0c29] border border-white/10 rounded-2xl p-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500">
                      <CheckCircle size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-xl">Exam Ready</h3>
                      <p className="text-xs text-gray-400">Generated 3 seconds ago</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8 text-left">
                     <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                       <span className="text-sm">Thermodynamics</span>
                       <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Heavy Focus</span>
                     </div>
                     <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                       <span className="text-sm">Derivatives</span>
                       <span className="text-xs font-bold bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">Review</span>
                     </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1" onClick={startExam}>Begin Now</Button>
                    <button 
                      onClick={() => setMockExamState('IDLE')}
                      className="px-4 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm font-bold"
                    >
                      Discard
                    </button>
                  </div>
                </motion.div>
              )}

              {mockExamState === 'ACTIVE' && (
                <div className="w-full max-w-2xl mx-auto flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-left">
                       <span className="text-xs text-gray-500 uppercase font-bold">Question {currentQuestionIndex + 1} / {MOCK_QUESTIONS.length}</span>
                       <div className="w-32 h-1.5 bg-gray-800 rounded-full mt-1">
                          <div className="h-full bg-primary" style={{ width: `${((currentQuestionIndex + 1) / MOCK_QUESTIONS.length) * 100}%` }} />
                       </div>
                    </div>
                    <div className="flex items-center gap-2 text-red-400 font-mono text-lg bg-red-400/10 px-3 py-1 rounded-lg border border-red-400/20">
                       <Clock size={16} /> 43:12
                    </div>
                  </div>

                  <div className="bg-[#0f0c29] border border-white/10 rounded-2xl p-8 mb-6 text-left">
                    <h3 className="text-xl font-bold leading-relaxed mb-8">{MOCK_QUESTIONS[currentQuestionIndex].question}</h3>
                    <div className="space-y-3">
                      {MOCK_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(idx)}
                          className={`w-full p-4 rounded-xl border text-left transition-all ${
                            selectedAnswers[currentQuestionIndex] === idx 
                              ? 'bg-primary/20 border-primary text-white' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              selectedAnswers[currentQuestionIndex] === idx ? 'border-primary' : 'border-gray-500'
                            }`}>
                              {selectedAnswers[currentQuestionIndex] === idx && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                            </div>
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button 
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      className="px-6 py-3 rounded-lg border border-white/10 text-gray-400 disabled:opacity-50 hover:bg-white/5"
                    >
                      Previous
                    </button>
                    {currentQuestionIndex < MOCK_QUESTIONS.length - 1 ? (
                      <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>Next Question</Button>
                    ) : (
                      <Button onClick={submitExam}>Submit Exam</Button>
                    )}
                  </div>
                </div>
              )}

              {mockExamState === 'REVIEW' && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="max-w-md w-full mx-auto bg-[#0f0c29] border border-white/10 rounded-2xl p-8"
                 >
                   <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                     <Target size={40} className="text-white" />
                   </div>
                   <h2 className="text-3xl font-display font-bold mb-2">Exam Complete</h2>
                   <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
                     {Math.round((examScore / MOCK_QUESTIONS.length) * 100)}%
                   </div>
                   
                   <p className="text-gray-400 mb-8">
                     {examScore === MOCK_QUESTIONS.length ? "Perfect score! Your mastery has increased." : "Good effort. AI has identified new focus areas."}
                   </p>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase">Correct</div>
                        <div className="font-bold text-green-400">{examScore} / {MOCK_QUESTIONS.length}</div>
                      </div>
                       <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase">XP Earned</div>
                        <div className="font-bold text-yellow-400">+{examScore * 50}</div>
                      </div>
                   </div>

                   <Button onClick={() => setMockExamState('IDLE')} className="w-full">Return to Dashboard</Button>
                 </motion.div>
              )}
            </div>
          )}

          {activeTab === 'INSIGHTS' && (
             <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-[#0f0c29] p-8 rounded-2xl border border-white/10">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-green-400"/> Performance Trend</h3>
                 <div className="h-64 flex items-end gap-2 px-4 border-b border-l border-white/10">
                   {[40, 45, 60, 55, 70, 65, 80, 85, 90, 88].map((h, i) => (
                      <div key={i} className="flex-1 bg-green-500/20 hover:bg-green-500/40 transition-colors rounded-t-sm relative group">
                        <div className="absolute bottom-0 w-full bg-green-500 rounded-t-sm" style={{ height: `${h}%` }} />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs p-1 rounded border border-white/10 opacity-0 group-hover:opacity-100">{h}%</div>
                      </div>
                   ))}
                 </div>
               </div>

               <div className="bg-[#0f0c29] p-8 rounded-2xl border border-white/10">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><AlertTriangle size={20} className="text-yellow-400"/> Knowledge Gaps</h3>
                 <div className="space-y-4">
                   {[
                     { topic: "Thermodynamics", score: 45 },
                     { topic: "Chain Rule", score: 52 },
                     { topic: "Renaissance Art", score: 68 }
                   ].map((gap, i) => (
                     <div key={i} className="bg-white/5 p-4 rounded-xl">
                       <div className="flex justify-between text-sm mb-2">
                         <span className="font-bold">{gap.topic}</span>
                         <span className="text-red-400 font-bold">{gap.score}% Mastery</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                         <div className="h-full bg-red-500" style={{ width: `${gap.score}%` }} />
                       </div>
                       <button 
                         onClick={() => handleStartRemedial(gap.topic)}
                         className="text-xs text-primary mt-2 hover:underline flex items-center gap-1"
                       >
                         Start Remedial Quest <Play size={10} />
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};