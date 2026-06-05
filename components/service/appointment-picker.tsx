"use client";

import { useState, useEffect, useMemo } from "react";
import { getAvailableSlots, DayAvailability, TimeSlot } from "@/lib/appointment-actions";
import { Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatYYYYMMDD, getMonday, addDays } from "@/lib/utils";

interface AppointmentPickerProps {
  sewistId: string;
  onSlotSelected: (start: string, end: string) => void;
}

export default function AppointmentPicker({ sewistId, onSlotSelected }: AppointmentPickerProps) {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(formatYYYYMMDD(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const [weekOffset, setWeekOffset] = useState(0);

  const mondayOfCurrentWeek = useMemo(() => {
    return getMonday(addDays(new Date(), weekOffset * 7));
  }, [weekOffset]);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(mondayOfCurrentWeek, i));
  }, [mondayOfCurrentWeek]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Find unique months in the current week view
        const months = new Set<string>();
        weekDates.forEach(d => {
          // Use UTC methods for unique month detection to match getAvailableSlots logic
          months.add(`${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`);
        });

        const fetchPromises = Array.from(months).map(m => {
          const [year, month] = m.split('-').map(Number);
          return getAvailableSlots(sewistId, year, month);
        });

        const results = await Promise.all(fetchPromises);
        const mergedAvailability = results.flat();
        
        // Remove duplicates if any (though getAvailableSlots is month-specific)
        const uniqueAvailability = mergedAvailability.filter((v, i, a) => 
          a.findIndex(t => t.date === v.date) === i
        );

        setAvailability(uniqueAvailability);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [sewistId, weekOffset]);

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

  // Determine month/year from mondayOfCurrentWeek for display
  const monthName = mondayOfCurrentWeek.toLocaleString('default', { month: 'long' });
  const currentYear = mondayOfCurrentWeek.getFullYear();

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl border border-primary-light/50 shadow-sm overflow-hidden flex flex-col">
      {/* Calendar Section */}
      <div className="p-5 bg-gray-50/50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-900">{monthName}</h3>
            <p className="text-xs text-gray-500">{currentYear}</p>
          </div>
          <div className="flex gap-1">
            <button 
              type="button"
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-600 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-600 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[240px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-y-2 gap-x-1">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-1">
                {d}
              </div>
            ))}
            
            {weekDates.map((date) => {
              const dateStr = formatYYYYMMDD(date);
              const isAvailable = availableDates.includes(dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === formatYYYYMMDD(new Date());

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => handleDateClick(dateStr)}
                  className={`
                    relative aspect-square flex items-center justify-center rounded-xl text-xs font-medium transition-all duration-200
                    ${isSelected 
                      ? 'bg-primary text-white shadow-sm' 
                      : isAvailable 
                        ? 'bg-white border border-gray-100 text-gray-700 hover:border-primary-light hover:text-primary active:scale-95' 
                        : 'text-gray-300 opacity-40 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="relative z-10">{date.getDate()}</span>
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
      <div className="border-t border-gray-100 bg-white p-5">
        <AnimatePresence mode="wait">
          {!selectedDate ? (
            <motion.div 
              key="no-date"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-gray-400 py-2"
            >
              <CalendarIcon className="w-4 h-4 opacity-50" />
              <p className="text-xs font-light tracking-wide">Select a date to see times</p>
            </motion.div>
          ) : (
            <motion.div 
              key="has-date"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {slotsForSelectedDate.length > 0 && (
                  <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                    {slotsForSelectedDate.length} slots
                  </span>
                )}
              </div>
              
              {slotsForSelectedDate.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-xs font-light italic">
                  No slots available
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                  {slotsForSelectedDate.map((slot, index) => {
                    const timeStr = new Date(slot.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
                    const isSelected = selectedSlot === slot.startTime;
                    
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        onClick={() => handleSlotClick(slot)}
                        className={`
                          py-2 px-1 rounded-xl border text-[11px] text-center transition-all duration-200 active:scale-[0.96]
                          ${isSelected 
                            ? 'border-third bg-secondary/50 text-third font-semibold' 
                            : 'border-gray-100 hover:border-primary-light text-gray-600'
                          }
                        `}
                      >
                        {timeStr}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
