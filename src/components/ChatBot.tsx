import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Greetings! I am the Elegant Mall AI Concierge. How may I assist you with your luxury shopping, dining, or delivery inquiries today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { sender: 'bot', text: "Pardon me, I encountered a temporary connection glitch. Please ask again!" }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: "Connection error. Please check if your network is stable." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Where is the Food Court?",
    "Any active promo coupons?",
    "What are the opening hours?",
    "Can you deliver to my home?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-tr from-[#d4af37] to-[#f0c75e] text-[#0c0c0e] font-black uppercase text-xs tracking-wider px-5 py-4 rounded-full shadow-2xl shadow-[#d4af37]/30 hover:scale-105 active:scale-95 cursor-pointer transition-all hover:rotate-[360deg] duration-500"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Ask AI Concierge</span>
        </button>
      )}

      {/* Expanded chat drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[550px] bg-[#141416]/98 border-2 border-[#d4af37] rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="bg-[#0c0c0e] border-b border-[#d4af37]/50 p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#d4af37]/10 p-2 rounded-xl text-[#d4af37]">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold tracking-wide">Elegant AI Concierge</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                  <span className="text-[10px] text-gray-400 font-mono">Grounded Facts Engine</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Panel */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#0c0c0e]/40 scroll-smooth">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar icon */}
                <div className={`p-1.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' ? 'bg-[#d4af37] text-[#0c0c0e]' : 'bg-white/10 text-white'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message body */}
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#d4af37]/25 border border-[#d4af37]/30 text-white rounded-tr-none'
                    : 'bg-[#141416] text-gray-300 border border-white/5 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="p-1.5 h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#141416] border border-white/5 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
                  <span className="text-[10px] text-gray-400 font-mono italic">Writing elegant reply...</span>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Fast click suggestion chips (only displayed if messages are few) */}
          {messages.length < 4 && (
            <div className="p-3 bg-[#0c0c0e]/30 border-t border-white/5 flex gap-2 overflow-x-auto shrink-0 select-none">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="bg-[#141416] hover:bg-[#d4af37]/10 text-gray-300 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/30 px-3 py-1.5 rounded-lg text-[10px] font-medium shrink-0 cursor-pointer transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input field Footer */}
          <div className="p-4 bg-[#0c0c0e] border-t border-white/5 flex gap-3 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(input); }}
              placeholder="Ask anything about our mall..."
              className="flex-1 bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors"
            />
            <button
              onClick={() => handleSendMessage(input)}
              className="bg-[#d4af37] hover:bg-[#f0c75e] text-[#0c0c0e] p-3 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
