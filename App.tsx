import React, { useState, useCallback, useRef, useEffect } from 'react';
import { streamGenerateContent } from './services/geminiService';
import { InputArea } from './components/InputArea';
import { ResultCard } from './components/ResultCard';
import { UserMessage } from './components/UserMessage';
import { BackgroundDoodles } from './components/BackgroundDoodles';
import { Spinner } from './components/Spinner';
import { ArrowUp, Eraser } from 'lucide-react';

// Component for the ticker text to ensure consistency in the loop
const TickerContent = () => (
  <div className="flex items-center">
    <span className="mx-12">LumeAI System</span>
    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
    <span className="mx-12">Illuminate Your Ideas</span>
    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
    <span className="mx-12">Powered by LumeAI</span>
    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
    <span className="mx-12">Next Gen Intelligence</span>
    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
  </div>
);

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const interactiveBlobRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Linear Interpolation (Lerp) for smooth fluidity
      // 0.08 is a good balance between responsiveness and floatiness
      const ease = 0.08; 
      
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      currentX += dx * ease;
      currentY += dy * ease;

      if (interactiveBlobRef.current) {
        // using translate3d for GPU acceleration
        interactiveBlobRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove);
    // Start animation loop
    animate();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleGenerate = useCallback(async () => {
    const currentPrompt = prompt.trim();
    if (!currentPrompt) return;

    // 1. Clear input immediately
    setPrompt('');
    setIsStreaming(true);
    setError(null);
    
    // 2. Add User Message and Placeholder Model Message
    const userMsgId = Date.now().toString();
    const modelMsgId = (Date.now() + 1).toString();
    
    setMessages(prev => [
      ...prev, 
      { id: userMsgId, role: 'user', content: currentPrompt },
      { id: modelMsgId, role: 'model', content: '' } // Placeholder
    ]);
    
    abortControllerRef.current = new AbortController();

    try {
      const stream = streamGenerateContent(currentPrompt);
      let accumulatedResponse = '';
      
      for await (const chunk of stream) {
        accumulatedResponse += chunk;
        
        // 3. Update the last message (the model placeholder) with new content
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsgIndex = newMessages.length - 1;
          // Ensure we are updating the correct message
          if (newMessages[lastMsgIndex].id === modelMsgId) {
            newMessages[lastMsgIndex] = {
              ...newMessages[lastMsgIndex],
              content: accumulatedResponse
            };
          }
          return newMessages;
        });
      }
      
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Connection interrupted. Please try again.");
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [prompt]);

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    setPrompt('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center selection:bg-fuchsia-500/30 selection:text-fuchsia-100 overflow-hidden relative font-sans">
      
      {/* Background Layer Group */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* Interactive Cursor Gradient - Performance Optimized */}
        <div 
          ref={interactiveBlobRef}
          className="absolute top-0 left-0 w-[900px] h-[900px] rounded-full mix-blend-screen filter blur-[100px] opacity-70 will-change-transform z-0"
          style={{ 
            // Initial position (center)
            transform: 'translate3d(50vw, 50vh, 0) translate(-50%, -50%)',
            background: 'radial-gradient(circle closest-side, rgba(139, 92, 246, 0.6), rgba(232, 121, 249, 0.4), rgba(6, 182, 212, 0.2), transparent)'
          }} 
        ></div>

        {/* 1. Ambient Aurora Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-fuchsia-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
        
        {/* 2. Hand-Drawn Doodles */}
        <BackgroundDoodles />
      </div>

      {/* Main Content */}
      <main className="w-full max-w-3xl px-6 py-12 md:py-20 z-10 flex flex-col flex-1 relative min-h-0">
        
        {/* Branding - Shows prominently when chat is empty, becomes a header otherwise */}
        <header className={`transition-all duration-700 ${messages.length > 0 ? 'mb-8 opacity-80 scale-90 origin-top' : 'mb-auto mt-20 text-center space-y-4'}`}>
           <div className={`inline-flex items-center justify-center p-4 bg-white/5 rounded-full border border-white/10 shadow-xl backdrop-blur-xl mb-2 hover:scale-110 transition-transform duration-300 group ${messages.length > 0 ? 'mx-auto flex' : ''}`}>
             {/* Custom Robot/Mascot Logo */}
            <svg 
              className="w-10 h-10 text-fuchsia-300 group-hover:text-fuchsia-200 transition-colors" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8" y2="16" />
              <line x1="16" y1="16" x2="16" y2="16" />
            </svg>
          </div>
          
          <div className={messages.length > 0 ? 'text-center' : ''}>
            <p className={`text-xs md:text-sm font-medium tracking-[0.3em] text-fuchsia-400 mb-2 uppercase opacity-90 ${messages.length > 0 ? 'hidden' : 'block'}`}>Introducing</p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400">
              LumeAI
            </h1>
          </div>
          
          <p className={`text-slate-400 text-lg font-light tracking-wide max-w-md mx-auto ${messages.length > 0 ? 'hidden' : 'block'}`}>
            Illuminate your ideas with next-generation intelligence.
          </p>
        </header>

        {/* Chat History */}
        <div className="w-full flex-1 flex flex-col gap-6 mb-8">
          {messages.map((msg, index) => {
            const isLast = index === messages.length - 1;
            if (msg.role === 'user') {
              return <UserMessage key={msg.id} content={msg.content} />;
            } else {
              // Only show streaming indicator on the very last message if we are actively streaming
              const showStreaming = isLast && isStreaming;
              // Don't render empty result cards until they have content or are streaming
              if (!msg.content && !showStreaming) return null;
              
              return (
                <ResultCard 
                  key={msg.id} 
                  content={msg.content} 
                  isStreaming={showStreaming} 
                />
              );
            }
          })}
          
          {error && (
            <div className="w-full animate-fade-in flex justify-center py-4">
              <div className="px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-200 text-sm font-medium backdrop-blur-sm">
                {error}
              </div>
            </div>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Zone - Pushed to bottom by flex-1 spacer if chat is empty, or follows chat history */}
        <div className={`w-full space-y-6 transition-all duration-500 ${messages.length === 0 ? 'mt-auto mb-20' : ''}`}>
          <InputArea 
            value={prompt} 
            onChange={setPrompt} 
            onEnter={handleGenerate}
            disabled={isStreaming}
            placeholder={messages.length > 0 ? "Reply to Lume..." : "Ask Lume anything..."}
          />
          
          <div className="flex justify-center gap-4">
             {messages.length > 0 && !isStreaming && (
               <button
                 onClick={handleClearChat}
                 className="flex items-center justify-center p-4 rounded-full bg-slate-800/40 text-slate-400 hover:bg-slate-700/50 hover:text-white transition-all border border-white/5 hover:border-white/10"
                 title="Clear Chat"
               >
                 <Eraser className="w-5 h-5" />
               </button>
             )}

            <button
              onClick={handleGenerate}
              disabled={isStreaming || !prompt.trim()}
              className={`
                group relative flex items-center gap-3 px-8 py-4 rounded-full font-medium transition-all duration-500
                ${isStreaming || !prompt.trim() 
                  ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]'
                }
              `}
            >
              {isStreaming ? (
                <>
                  <Spinner size="sm" color="currentColor" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

      </main>

      {/* Scrolling Footer */}
      <footer className="w-full border-t border-white/5 bg-[#020617]/50 backdrop-blur-md z-10 overflow-hidden relative mt-auto">
         {/* Gradient fade masks for the edges */}
         <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-[#020617] to-transparent z-20 pointer-events-none"></div>
         <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-[#020617] to-transparent z-20 pointer-events-none"></div>

         <div className="flex w-fit animate-scroll whitespace-nowrap py-5 text-xs font-medium tracking-[0.3em] text-slate-500/50 uppercase select-none">
            {/* 3 Copies to ensure seamless loop on large screens */}
            <TickerContent />
            <TickerContent />
            <TickerContent />
         </div>
      </footer>
    </div>
  );
};

export default App;