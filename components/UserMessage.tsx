import React from 'react';
import { User } from 'lucide-react';

interface UserMessageProps {
  content: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({ content }) => {
  return (
    <div className="w-full flex justify-end animate-fade-in my-6">
      <div className="flex items-start gap-4 max-w-[85%] flex-row-reverse">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-sm">
          <User className="w-5 h-5 text-slate-300" />
        </div>
        
        <div className="relative group">
           {/* Decorative glow */}
           <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           
           <div className="relative px-6 py-4 rounded-3xl rounded-tr-sm bg-[#1e293b] border border-white/5 shadow-xl">
             <p className="text-slate-200 leading-relaxed font-light text-base md:text-lg whitespace-pre-wrap">
               {content}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};