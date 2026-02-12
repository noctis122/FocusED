import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calendar as CalIcon, Layout, 
  Clock, MapPin, Plus, Brain, Target, Zap, CheckCircle, 
  AlertTriangle, ArrowRight, X, Edit3, Trash2, Dumbbell
} from 'lucide-react';
import { useDemoContext } from '../../context/DemoContext';
import { CalendarEvent, EventType, ViewState } from '../../types';
import { Button } from '../ui/Button';
import { useSound } from '../../hooks/useSound';
import { GymQuestModal } from '../dashboard/GymQuestModal';

// --- HELPERS ---

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

// --- SUB-COMPONENTS ---

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewState) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose, onNavigate }) => {
  const { updateCalendarEvent, deleteCalendarEvent, courses, startSession, addQuest, quests } = useDemoContext();
  const { playClick, playUnlock } = useSound();
  const [showGymHub, setShowGymHub] = useState(false);
  
  if (!isOpen || !event) return null;

  const course = courses.find(c => c.id === event.courseId);
  const color = course?.color || (event.type === 'EXAM' ? '#ff0055' : event.type === 'PERSONAL' ? '#f0db4f' : event.type === 'FITNESS' ? '#f97316' : '#00f2ea');

  const handlePrimaryAction = () => {
    playClick();
    if (event.type === 'EXAM') {
      onClose();
      onNavigate('STUDENT_EXAM');
    } else if (event.type === 'FITNESS') {
      setShowGymHub(true);
    } else if (event.type === 'STUDY' || event.type === 'QUEST') {
      onClose();
      const tempQuestId = `temp_${Date.now()}`;
      addQuest({
        id: tempQuestId,
        title: event.title,
        courseId: event.courseId || 'SYSTEM',
        type: 'SESSION',
        duration: 25,
        difficulty: 'MEDIUM',
        status: 'ACTIVE',
        aiConfidence: 90,
        xpReward: 100
      });
      startSession(tempQuestId);
      onNavigate('FOCUS_MODE');
    }
  };

  const handleComplete = () => {
    playUnlock();
    updateCalendarEvent(event.id, { completed: !event.completed });
    onClose();
  };

  const handleDelete = () => {
    deleteCalendarEvent(event.id);
    onClose();
  };

  const handleGymStart = () => {
    const questId = event.questId || 'q_gym';
    startSession(questId);
    onClose();
    onNavigate('FOCUS_MODE');
  };

  if (showGymHub && event.type === 'FITNESS') {
    const gymQuest = quests.find(q => q.id === event.questId) || {
      id: 'gym_mock',
      title: event.title,
      type: 'FITNESS',
      duration: 60,
      courseId: 'PERSONAL',
      difficulty: 'MEDIUM',
      status: 'AVAILABLE',
      aiConfidence: 100,
      xpReward: 200
    } as any;

    return (
      <GymQuestModal 
        quest={gymQuest} 
        onClose={onClose} 
        onStart={handleGymStart} 
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0f0c29] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden relative"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: `0 0 40px ${color}20` }}
      >
        <div className="h-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f0c29]" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundColor: color }} />
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/20 rounded-full p-1"><X size={20}/></button>
          
          <div className="absolute bottom-4 left-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 text-white border border-white/10">
                {event.type}
              </span>
              {event.aiSuggested && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
                  <Brain size={10} /> AI Suggested
                </span>
              )}
            </div>
            <h2 className="text-2xl font-display font-bold">{event.title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-1">
                <Clock size={12} /> Time
              </div>
              <div className="text-sm font-bold">
                {event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
            {event.location && (
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-1">
                  <MapPin size={12} /> Location
                </div>
                <div className="text-sm font-bold truncate">{event.location}</div>
              </div>
            )}
          </div>

          <div>
             <h3 className="text-sm font-bold text-gray-400 mb-2">Description</h3>
             <p className="text-gray-300 text-sm leading-relaxed">
               {event.description || "No description provided."}
             </p>
          </div>

          {event.aiSuggested && (
             <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3">
               <Brain size={20} className="text-primary flex-none mt-1" />
               <div>
                 <div className="text-primary font-bold text-sm mb-1">Study Strategy</div>
                 <p className="text-xs text-primary/80">Recommended based on your recent performance in {course?.name || 'this subject'}. High impact session.</p>
               </div>
             </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-white/10">
            {event.type === 'EXAM' && (
              <Button onClick={handlePrimaryAction} className="flex-1 w-full">
                Launch Exam Prep <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
            {(event.type === 'STUDY' || event.type === 'QUEST') && (
              <Button onClick={handlePrimaryAction} className="flex-1 w-full">
                Start Session <Zap size={16} className="ml-2" />
              </Button>
            )}
            {event.type === 'FITNESS' && (
              <Button onClick={handlePrimaryAction} className="flex-1 w-full !bg-orange-500 !text-black !border-orange-500 hover:!bg-orange-400">
                Open Gym Hub <Dumbbell size={16} className="ml-2" />
              </Button>
            )}
            
            <button onClick={handleComplete} className={`p-3 rounded-lg border transition-all ${event.completed ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}>
              <CheckCircle size={20} />
            </button>
            <button onClick={handleDelete} className="p-3 rounded-lg bg-white/5 text-gray-400 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const CalendarView: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  const { calendarEvents, courses, addCalendarEvent, updateCalendarEvent } = useDemoContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { playClick, playHover } = useSound();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  useEffect(() => {
    // Slight delay to ensure enter animations don't conflict
    const t = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const today = new Date();
  const isToday = (day: number) => 
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    setDraggedEvent(eventId);
    e.dataTransfer.setData('text/plain', eventId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    const targetDate = new Date(year, month, day);
    
    // Find original event to keep time
    const originalEvent = calendarEvents.find(ev => ev.id === eventId);
    if (originalEvent) {
      const timeDiff = originalEvent.end.getTime() - originalEvent.start.getTime();
      const newStart = new Date(targetDate);
      newStart.setHours(originalEvent.start.getHours(), originalEvent.start.getMinutes());
      
      const newEnd = new Date(newStart.getTime() + timeDiff);
      
      updateCalendarEvent(eventId, { start: newStart, end: newEnd });
      playClick(); // Sound effect on drop
    }
    setDraggedEvent(null);
  };

  const handleAddEvent = () => {
    playClick();
    const day = selectedDate ? selectedDate.getDate() : today.getDate();
    const newEvent: CalendarEvent = {
      id: `custom_${Date.now()}`,
      title: 'New Personal Task',
      start: new Date(year, month, day, 12, 0),
      end: new Date(year, month, day, 13, 0),
      type: 'PERSONAL',
      description: 'Custom event added via calendar.',
      completed: false
    };
    addCalendarEvent(newEvent);
    setSelectedEvent(newEvent);
  };

  const renderDays = () => {
    const daysArray = [];
    
    // Empty cells for padding
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-32 md:h-40 bg-[#050510]/30 border-r border-b border-white/5" />);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = calendarEvents.filter(e => 
        e.start.getDate() === day && 
        e.start.getMonth() === month && 
        e.start.getFullYear() === year
      ).sort((a, b) => a.start.getTime() - b.start.getTime());

      const isCurrentDay = isToday(day);

      daysArray.push(
        <div 
          key={day}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, day)}
          onClick={() => setSelectedDate(date)}
          className={`h-32 md:h-40 border-r border-b border-white/10 p-2 relative transition-colors group ${
            isCurrentDay ? 'bg-primary/5' : 'hover:bg-white/5'
          } ${selectedDate?.getDate() === day ? 'bg-white/5' : ''}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
              isCurrentDay ? 'bg-primary text-black' : 'text-gray-400 group-hover:text-white'
            }`}>
              {day}
            </span>
            {dayEvents.length > 0 && dayEvents.every(e => e.completed) && (
               <CheckCircle size={14} className="text-green-500" />
            )}
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[calc(100%-30px)] custom-scrollbar">
            {dayEvents.map(event => {
              const course = courses.find(c => c.id === event.courseId);
              const color = course?.color || (event.type === 'EXAM' ? '#ff0055' : event.type === 'PERSONAL' ? '#f0db4f' : event.type === 'FITNESS' ? '#f97316' : '#00f2ea');
              
              return (
                <motion.div
                  key={event.id}
                  layoutId={event.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e as any, event.id)}
                  onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); playClick(); }}
                  whileHover={{ scale: 1.02, x: 2 }}
                  className={`text-[10px] md:text-xs p-1.5 rounded border border-l-2 cursor-pointer relative overflow-hidden transition-all ${
                    event.completed ? 'opacity-50 grayscale' : 'shadow-lg'
                  }`}
                  style={{ 
                    backgroundColor: `${color}15`, 
                    borderColor: `${color}30`,
                    borderLeftColor: color,
                    boxShadow: event.type === 'EXAM' ? `0 0 10px ${color}40` : 'none'
                  }}
                >
                  <div className="flex items-center gap-1.5 font-bold truncate">
                    {event.type === 'EXAM' && <AlertTriangle size={10} className="text-red-400 flex-none" />}
                    {event.aiSuggested && <Brain size={10} className="text-primary flex-none" />}
                    {event.type === 'FITNESS' && <Dumbbell size={10} className="text-orange-500 flex-none" />}
                    <span style={{ color: event.completed ? 'gray' : 'white' }}>{event.title}</span>
                  </div>
                  {event.aiSuggested && (
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    return daysArray;
  };

  return (
    <div className="min-h-screen bg-[#030014] pt-24 px-4 md:px-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AnimatePresence>
        {selectedEvent && (
          <EventModal 
            event={selectedEvent} 
            isOpen={!!selectedEvent} 
            onClose={() => setSelectedEvent(null)}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <CalIcon className="text-primary" /> Command Schedule
            </h1>
            <p className="text-gray-400 text-sm">Orchestrate your academic campaign.</p>
          </div>

          <div className="flex items-center gap-2 bg-[#0f0c29] p-1.5 rounded-xl border border-white/10">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={16}/></button>
            
            <div className="relative">
              <select 
                value={month}
                onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
                className="appearance-none bg-transparent font-bold text-center text-sm md:text-base w-28 md:w-32 py-1 cursor-pointer focus:outline-none hover:text-primary transition-colors"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i} className="bg-[#0f0c29] text-white">{m}</option>
                ))}
              </select>
            </div>
            <span className="font-bold text-sm md:text-base">{year}</span>

            <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronRight size={16}/></button>
            <button onClick={handleToday} className="text-xs font-bold uppercase bg-white/5 px-3 py-1.5 rounded hover:bg-white/10 transition-colors ml-1">Today</button>
          </div>

          <Button onClick={handleAddEvent}>
            <Plus size={16} className="mr-2" /> Add Event
          </Button>
        </div>

        {/* AI SUGGESTION BANNER */}
        <div 
          className={`bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-4 flex items-center gap-4 transition-all duration-700 transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-none">
            <Brain size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm text-primary">AI Strategy Update</h3>
            <p className="text-xs text-gray-300">Based on your heavy workload on the 24th, I've scheduled two recovery sessions. <span className="underline cursor-pointer hover:text-white">Review suggestions</span>.</p>
          </div>
          <button className="text-xs font-bold bg-primary/20 text-primary px-3 py-1.5 rounded hover:bg-primary/30 transition-colors">Apply All</button>
        </div>

        {/* CALENDAR GRID */}
        <div className="bg-[#0f0c29] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-white/5 border-b border-white/10">
            {DAYS.map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold uppercase text-gray-500 tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7">
            {renderDays()}
          </div>
        </div>

        {/* LEGEND / FOOTER */}
        <div className="flex gap-6 text-xs text-gray-500 justify-center">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> Classes</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ff0055]" /> Exams</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#f0db4f]" /> Personal</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500" /> Fitness</div>
          <div className="flex items-center gap-2"><Brain size={12} className="text-primary" /> AI Suggestion</div>
        </div>

      </div>
    </div>
  );
};
