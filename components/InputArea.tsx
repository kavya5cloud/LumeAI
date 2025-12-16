import React, { useRef, useEffect } from 'react';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  onEnter,
  disabled = false,
  placeholder = "Ask Lume anything..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onEnter) {
        onEnter();
      }
    }
  };

  return (
    <div className="relative group w-full max-w-2xl mx-auto">
      {/* Soft Glow Behind */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-3xl opacity-20 group-focus-within:opacity-50 blur-xl transition-opacity duration-700 pointer-events-none"></div>
      
      <div className="relative bg-[#1e293b]/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 group-focus-within:bg-[#1e293b]/70 group-focus-within:border-white/20">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder-slate-400/70 p-6 text-lg focus:outline-none resize-none min-h-[80px] leading-relaxed rounded-3xl"
          spellCheck={false}
        />
        
        <div className="absolute bottom-4 right-6 text-xs text-slate-500/60 font-medium pointer-events-none transition-opacity duration-300 opacity-0 group-focus-within:opacity-100">
          {value.length} chars
        </div>
      </div>
    </div>
  );
};