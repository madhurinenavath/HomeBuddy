import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = "", containerClassName = "", required, ...props }, ref) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            required={required}
            className={`
              w-full py-3 rounded-xl border border-gray-200 outline-none transition-all
              ${leftIcon ? "pl-11" : "pl-4"} 
              ${rightIcon ? "pr-11" : "pr-4"}
              ${error 
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                : "focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50 focus:bg-white"
              }
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-xs font-bold mt-2 animate-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
