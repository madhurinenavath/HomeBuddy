import { ReactNode } from "react";

interface FormLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function FormLayout({ title, subtitle, children, icon }: FormLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-50 min-h-[calc(100vh-200px)]">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center mb-8">
          {icon && (
            <div className="inline-flex bg-primary/10 p-3 rounded-xl mb-4">
              {icon}
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-2">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
