'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Source {
  title: string;
  href: string;
  similarity: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Merhaba! Bimser ürünleri hakkında sormak istediğiniz bir şey var mı? Dokümanlar hakkında sorularınızı buradan sorabilirsiniz.' }
  ]);
  const [input, setInput] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ask/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          product_filter: productFilter || null,
          top_k: 5
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'API Hatası');
      }

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      }]);
    } catch (error: any) {
      toast.error(error.message);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Üzgünüm, cevap üretirken bir hata oluştu: ' + error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-center items-center mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center uppercase">Bimser Chat </h1>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-700 rounded-sm flex flex-col overflow-hidden shadow-sm">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-100 dark:bg-transparent">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 border ${
                msg.role === 'user' ? 'bg-eba text-white border-eba' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-sm ${
                  msg.role === 'user' 
                    ? 'bg-eba text-white shadow-sm' 
                    : 'bg-white dark:bg-[#202022] text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 shadow-sm'
                }`}>
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-100 dark:prose-pre:bg-[#141415] prose-pre:border prose-pre:border-gray-300 dark:prose-pre:border-gray-700">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="w-full bg-white dark:bg-[#141415] rounded-sm p-4 border border-gray-300 dark:border-gray-700 mt-2 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kullanılan Kaynaklar</p>
                    </div>
                    <div className="space-y-2">
                      {msg.sources.map((s, i) => (
                        <div key={i} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-[#1b1b1d] px-3 py-2 rounded-sm border border-gray-300 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300 truncate pr-4 font-semibold">{s.title}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-white dark:bg-[#202022] px-2 py-1 rounded-sm border border-gray-300 dark:border-gray-600">
                            {(s.similarity * 100).toFixed(1)}% Benzerlik
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-sm bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-[#202022] p-4 rounded-sm border border-gray-300 dark:border-gray-700 flex items-center gap-3 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-eba" />
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium animate-pulse">BimserAI düşünüyor...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-100 dark:bg-[#1b1b1d] border-t border-gray-300 dark:border-gray-700">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Dokümanlar hakkında bir şey sorun..."
              disabled={isLoading}
              className="w-full bg-white dark:bg-[#141415] border border-gray-300 dark:border-gray-600 rounded-sm py-3 pl-4 pr-14 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-eba focus:ring-1 focus:ring-eba disabled:opacity-50 transition-colors shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-eba hover:bg-orange-600 text-white rounded-sm disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
