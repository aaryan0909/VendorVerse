import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ children, variant = 'primary', className = '', isLoading = false, ...props }: any) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-extrabold transition-all transform active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";
  
  const variants = {
    primary: "bg-brand-saffron text-white hover:bg-orange-600 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1",
    secondary: "bg-brand-green text-white hover:bg-green-700 border-b-4 border-green-800 active:border-b-0 active:translate-y-1",
    outline: "border-2 border-gray-200 bg-white text-gray-700 hover:border-brand-saffron hover:text-brand-saffron",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
  };

  return (
    <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', onClick }: any) => (
  <div 
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const Input = ({ label, className = '', ...props }: any) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-bold text-gray-800 mb-1.5">{label}</label>}
    <input 
      className={`w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-saffron focus:ring-0 transition-all font-medium bg-gray-50 focus:bg-white ${className}`} 
      {...props} 
    />
  </div>
);

export const Badge = ({ children, variant = 'gray', className = '' }: any) => {
    const colors = {
        gray: 'bg-gray-100 text-gray-800',
        green: 'bg-green-100 text-green-800 border-green-200',
        blue: 'bg-blue-100 text-blue-800',
        saffron: 'bg-orange-100 text-orange-800 border-orange-200',
        gold: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${colors[variant as keyof typeof colors]} ${className}`}>
            {children}
        </span>
    )
}

export const Toggle = ({ checked, onChange }: any) => (
    <button 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-brand-green' : 'bg-gray-200'}`}
    >
        <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
)
