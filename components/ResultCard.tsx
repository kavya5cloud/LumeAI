import React, { useEffect, useState } from 'react';
import { Copy, Check, Stars } from 'lucide-react';

interface ResultCardProps {
  content: string;
  isStreaming: boolean;
}

const ContentRenderer: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const content = part.slice(3, -3);
          const firstLineBreak = content.indexOf('\n');
          const language = firstLineBreak !== -1 ? content.slice(0, firstLineBreak).trim() : '';
          const code = firstLineBreak !== -1 ? content.slice(firstLineBreak + 1) : content;

          return (
            <div key={index} className="my-6 rounded-2xl overflow-hidden bg-[#0f172a]/60 border border-white/5 shadow-inner">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <span className="text-xs font-mono text-slate-400 lowercase">{language || 'code'}</span>
                <div className="flex gap-1.5 opacity-50">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                </div>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-slate-200 leading-relaxed">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          );
        } else {
          if (!part) return null;
          return (
            <div key={index} className="whitespace-pre-wrap leading-8 text-slate-200 mb-4 font-light">
                {part}
            </div>
          );
        }
      })}
    </>
  );
};

export const ResultCard: React.FC<ResultCardProps> = ({ content, isStreaming }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative w-full animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-500">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${isStreaming ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-slate-700/30 text-slate-400'}`}>
               <Stars className={`w-4 h-4 ${isStreaming ? 'animate-pulse' : ''}`} />
            </div>
            <span className="text-sm font-medium tracking-wide text-slate-300">
              {isStreaming ? 'Lume is creating...' : 'Response'}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white text-xs font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 font-sans text-base md:text-lg">
            <ContentRenderer text={content} />
            {isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 align-middle bg-fuchsia-400 rounded-full animate-pulse"></span>
            )}
        </div>
      </div>
    </div>
  );
};