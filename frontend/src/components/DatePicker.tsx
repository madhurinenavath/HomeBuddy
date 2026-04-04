import { useState, useEffect } from "react";

interface DatePickerProps {
  onSelect: (dateValue: string, slotValue: string) => void;
}

export function DatePicker({ onSelect }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const dates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    return {
      value: `${yyyy}-${mm}-${dd}`,
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: date.getDate(),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const slots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"];

  useEffect(() => {
    if (selectedDate && selectedSlot) {
      onSelect(selectedDate, selectedSlot);
    }
  }, [selectedDate, selectedSlot, onSelect]);

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Select Date</h3>
        
        {/* Custom hide-scrollbar class might be needed in utility, fallback works perfectly */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}">
          {dates.map((d) => (
            <button
              key={d.value}
              onClick={() => { setSelectedDate(d.value); setSelectedSlot(""); }}
              className={`flex-shrink-0 flex flex-col items-center justify-center py-4 px-6 rounded-2xl border-2 transition-all min-w-[100px] snap-center ${selectedDate === d.value ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50 bg-white'}`}
            >
               <span className="text-xs font-bold uppercase mb-1">{d.dayOfWeek}</span>
               <span className="text-2xl font-black mb-1">{d.dayOfMonth}</span>
               <span className="text-xs font-medium opacity-60 text-center whitespace-nowrap">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Select Time</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {slots.map((slot) => (
            <button
              key={slot}
              disabled={!selectedDate}
              onClick={() => setSelectedSlot(slot)}
              className={`py-4 px-4 rounded-xl border-2 transition-all font-bold text-sm ${
                !selectedDate ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400' :
                selectedSlot === slot ? 'border-primary bg-primary text-white shadow-md transform scale-[1.02]' : 'border-gray-100 bg-white text-gray-600 hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
