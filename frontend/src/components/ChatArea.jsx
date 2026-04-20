import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const MessageBubble = ({ role, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={cn(
      "flex w-full mb-6 gap-4",
      role === 'user' ? "flex-row-reverse" : "flex-row"
    )}
  >
    <div className={cn(
      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
      role === 'user' ? "bg-indigo-600 shadow-indigo-500/20" : "bg-slate-800 border border-slate-700 shadow-slate-900/50"
    )}>
      {role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-indigo-400" />}
    </div>
    <div className={cn(
      "max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed",
      role === 'user' 
        ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-900/20" 
        : "glass rounded-tl-none text-slate-200"
    )}>
      {content}
    </div>
  </motion.div>
);

export const ChatArea = ({ mode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const modeLabels = {
    general: "General Assistant",
    resume: "Resume Analyzer",
    career: "Career Guidance",
    notes: "Notes Generator",
    quiz: "Quiz Generator"
  };

  useEffect(() => {
    // Initial greeting
    setMessages([{
      role: 'assistant',
      content: `Hello! I'm your ${modeLabels[mode]}. How can I help you today?`
    }]);
  }, [mode]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/chat', {
        message: userMessage,
        mode: mode
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please make sure the backend is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 ml-72 h-screen flex flex-col relative bg-slate-950 overflow-hidden">
      {/* Header */}
      <header className="h-16 glass border-b border-slate-800/50 flex items-center px-8 sticky top-0 z-10">
        <h2 className="font-semibold text-slate-200">{modeLabels[mode]}</h2>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 pb-32">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} {...msg} />
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex gap-4 items-center text-slate-400">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
              <span className="text-sm italic">Thinking...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask me anything about ${modeLabels[mode]}...`}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 pl-6 pr-16 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-2xl placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-900/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
};
