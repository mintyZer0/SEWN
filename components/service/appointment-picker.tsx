"use client";

import { useState, useEffect } from "react";
import { getAvailableSlots, DayAvailability, TimeSlot } from "@/lib/appointment-actions";
import { Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AppointmentPickerProps {
  sewistId: string;
  onSlotSelected: (start: string, end: string) => void;
}

export default function AppointmentPicker({ sewistId, onSlotSelected }: AppointmentPickerProps) {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAvailableSlots(sewistId, currentMonth.year, currentMonth.month);
        setAvailability(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [sewistId, currentMonth]);

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot("");
  };

  const handleSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot.startTime);
    onSlotSelected(slot.startTime, slot.endTime);
  };

  const availableDates = availability.map(a => a.date);
  const slotsForSelectedDate = availability.find(a => a.date === selectedDate)?.slots || [];

  const daysInMonth = new Date(currentMonth.year, currentMonth.month, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.year, currentMonth.month - 1, 1).getDay();
  
  const monthName = new Date(currentMonth.year, currentMonth.month - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="w-full bg-white rounded-3xl border border-primary-light/50 shadow-sm overflow-hidden flex flex-col md:flex-row">
      {/* Calendar Section */}
      <div className="flex-1 p-6 md:p-8 bg-gray-50/50">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900">{monthName}</h3>
              <p className="text-sm text-gray-500">{currentMonth.year}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setCurrentMonth(prev => prev.month === 1 ? { year: prev.year - 1, month: 12 } : { ...prev, month: prev.month - 1 })}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              type="button"
              onClick={() => setCurrentMonth(prev => prev.month === 12 ? { year: prev.year + 1, month: 1 } : { ...prev, month: prev.month + 1 })}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[280px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-y-4 gap-x-2">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
                {d}
              </div>
            ))}
            
            {/* Empty slots for start of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dateStr = `${currentMonth.year}-${currentMonth.month.toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`;
              const isAvailable = availableDates.includes(dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === today.toISOString().split('T')[0];

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => handleDateClick(dateStr)}
                  className={`
                    relative aspect-square flex items-center justify-center rounded-2xl text-sm font-medium transition-all duration-300
                    ${isSelected 
                      ? 'bg-primary text-white shadow-md scale-105' 
                      : isAvailable 
                        ? 'bg-white border border-gray-100 text-gray-700 hover:border-primary-light hover:text-primary hover:shadow-sm active:scale-95' 
                        : 'text-gray-300 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="relative z-10">{i + 1}</span>
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-third" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Time Slots Section */}
      <div className="md:w-72 border-t md:border-t-0 md:border-l border-gray-100 bg-white p-6 md:p-8 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Time</h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {!selectedDate ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-3 text-gray-400 py-12"
              >
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                  <CalendarIcon className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-sm">Select a date to see<br/>available times</p>
              </motion.div>
            ) : slotsForSelectedDate.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-center py-8 text-gray-500 text-sm"
              >
                No slots available on this date.
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-3"
              >
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  {new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
                
                {slotsForSelectedDate.map((slot, index) => {
                  const timeStr = new Date(slot.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                  const isSelected = selectedSlot === slot.startTime;
                  
                  return (
                    <motion.button
                      key={slot.startTime}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      type="button"
                      onClick={() => handleSlotClick(slot)}
                      className={`
                        w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-200 active:scale-[0.98]
                        ${isSelected 
                          ? 'border-third bg-secondary/50 text-third font-medium shadow-sm' 
                          : 'border-gray-100 hover:border-primary-light hover:bg-primary-light/30 text-gray-700'
                        }
                      `}
                    >
                      <span>{timeStr}</span>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className="w-2 h-2 rounded-full bg-third" 
                        />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
