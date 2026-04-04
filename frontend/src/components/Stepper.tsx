import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full flex items-center justify-between relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all duration-300 ${
                isCompleted 
                  ? 'bg-primary border-primary text-white' 
                  : isCurrent 
                    ? 'bg-white border-primary text-primary shadow-md ring-4 ring-primary/20' 
                    : 'bg-white border-gray-200 text-gray-400'
              }`}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
            </div>
            <span className={`mt-2 text-xs md:text-sm font-bold absolute -bottom-6 ${
              isCurrent ? 'text-primary' : isCompleted ? 'text-gray-800' : 'text-gray-400'
            }`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
