import { Check, Clock } from "lucide-react";

export type OrderStage = "Requested" | "Assigned" | "OnTheWay" | "InProgress" | "Completed";

interface TimelineProps {
  currentStage: OrderStage;
}

const STAGES = [
  { key: "Requested", label: "Booking Requested", description: "Waiting for professional assignment" },
  { key: "Assigned", label: "Professional Assigned", description: "Mohammad Ali has been assigned" },
  { key: "OnTheWay", label: "On The Way", description: "Professional is heading to your location" },
  { key: "InProgress", label: "Service In Progress", description: "Work is currently being done" },
  { key: "Completed", label: "Service Completed", description: "Please leave a rating!" },
];

export function Timeline({ currentStage }: TimelineProps) {
  const currentIndex = STAGES.findIndex(s => s.key === currentStage);

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={stage.key} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-white border-4 flex-shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-all ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-gray-200 text-gray-400'}`}>
              {isCompleted ? <Check className="h-5 w-5" /> : isCurrent ? <Clock className="h-5 w-5 animate-pulse" /> : <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />}
            </div>
            
            <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm transition-all ${isCurrent ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white opacity-80'}`}>
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className={`font-bold ${isCurrent ? 'text-primary' : isPending ? 'text-gray-400' : 'text-gray-800'}`}>
                  {stage.label}
                </div>
              </div>
              <div className={`text-sm ${isCurrent ? 'text-gray-600' : 'text-gray-500'}`}>
                {stage.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
