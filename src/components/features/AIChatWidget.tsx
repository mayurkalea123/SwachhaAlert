import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, X, Send, Minimize2, Maximize2, Sparkles,
  RefreshCw, ChevronRight, CheckCircle2, AlertCircle, Zap
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { ChatMessage, FormSuggestion } from '@/types/chat';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Props {
  onFillForm?: (suggestion: FormSuggestion) => void;
  showOnReportPage?: boolean;
}

const FAQ_CHIPS = [
  { label: '🚛 How does AI dispatch work?', msg: 'How does the AI auto-dispatch work?' },
  { label: '⏰ What are dispatch hours?', msg: 'What are the dispatch operating hours?' },
  { label: '📊 Reports needed to trigger?', msg: 'How many reports trigger automatic dispatch?' },
  { label: '🗑 Report a garbage pile', msg: 'I want to report a garbage issue near my home' },
];

const WELCOME_MSG = `Hi! I'm SwachhaAlert AI 🌿

I can help you:
• Describe your garbage issue & auto-fill the report form
• Answer questions about how AI dispatch works
• Guide you through the reporting process

What's the issue in your area?`;

function parseFormSuggestion(text: string): { cleanText: string; suggestion: FormSuggestion | null } {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) return { cleanText: text, suggestion: null };
  try {
    const parsed = JSON.parse(jsonMatch[1]);
    const cleanText = text.replace(/```json[\s\S]*?```/g, '').trim();
    if (!parsed.hasFormData) return { cleanText, suggestion: null };
    return {
      cleanText,
      suggestion: {
        wasteType: parsed.wasteType,
        priority: parsed.priority,
        description: parsed.description,
        location: parsed.location,
      }
    };
  } catch {
    return { cleanText: text.replace(/```json[\s\S]*?```/g, '').trim(), suggestion: null };
  }
}

export default function AIChatWidget({ onFillForm, showOnReportPage }: Props) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: WELCOME_MSG, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [filledForm, setFilledForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  useEffect(() => {
    if (open) {
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(async (userText?: string) => {
    const text = (userText ?? input).trim();
    if (!text || loading) return;

    setInput('');
    setFilledForm(false);

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setStreamingText('');

    const history = [...messages.filter(m => m.id !== 'welcome'), userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      abortRef.current = new AbortController();

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/swachha-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token ?? import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ messages: history, stream: true }),
          signal: abortRef.current.signal,
        }
      );

      if (!response.ok || !response.body) throw new Error('AI connection failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content ?? '';
            fullText += delta;
            setStreamingText(fullText);
          } catch { /* skip */ }
        }
      }

      const { cleanText, suggestion } = parseFormSuggestion(fullText);
      setMessages(prev => [...prev, {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: cleanText || fullText,
        timestamp: new Date(),
        formSuggestion: suggestion ?? undefined,
      }]);
      setStreamingText('');
      if (!open) setHasNewMessage(true);

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }]);
      setStreamingText('');
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, open]);

  const handleFillForm = (suggestion: FormSuggestion) => {
    if (onFillForm) {
      onFillForm(suggestion);
      setFilledForm(true);
    }
  };

  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([{ id: 'welcome', role: 'assistant', content: WELCOME_MSG, timestamp: new Date() }]);
    setStreamingText('');
    setInput('');
    setFilledForm(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const cleanStreamDisplay = streamingText.replace(/```json[\s\S]*?```/g, '').trim();

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[90] group"
          aria-label="Open AI Chat Assistant"
        >
          <div className="relative">
            <div className="w-14 h-14 gradient-brand rounded-2xl shadow-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-emerald-500 pulse-ring pointer-events-none" />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">1</span>
            )}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-foreground text-white text-xs px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg">
                AI Assistant
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className={`fixed bottom-6 right-6 z-[90] w-[360px] max-w-[calc(100vw-24px)] flex flex-col transition-all duration-300 ${minimized ? 'h-14' : 'h-[540px]'}`}>
          <div className="bg-white border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">

            {/* Header */}
            <div className="gradient-brand px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                  {loading && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
                      <Sparkles className="w-2 h-2 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">SwachhaAlert AI</p>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-300'}`} />
                    <p className="text-emerald-100 text-[10px]">{loading ? 'Thinking…' : 'Online'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={resetChat} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/25 transition-colors" title="Reset">
                  <RefreshCw className="w-3.5 h-3.5 text-white" />
                </button>
                <button onClick={() => setMinimized(!minimized)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/25 transition-colors">
                  {minimized ? <Maximize2 className="w-3.5 h-3.5 text-white" /> : <Minimize2 className="w-3.5 h-3.5 text-white" />}
                </button>
                <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/25 transition-colors">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gradient-to-b from-emerald-50/40 to-white">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[78%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'gradient-brand text-white rounded-tr-sm shadow-sm'
                            : 'bg-white border border-border text-foreground rounded-tl-sm shadow-sm'
                        }`}>
                          {msg.content.split('\n').map((line, i, arr) => (
                            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                          ))}
                        </div>

                        {/* Form fill card */}
                        {msg.formSuggestion && onFillForm && (
                          <div className="w-full bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Zap className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-xs font-bold text-emerald-700">Form Auto-Fill Ready</span>
                            </div>
                            <div className="space-y-1 mb-3">
                              {msg.formSuggestion.wasteType && (
                                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800">
                                  <span className="font-semibold w-16 flex-shrink-0">Waste:</span>
                                  <span className="bg-emerald-100 px-1.5 py-0.5 rounded capitalize">{msg.formSuggestion.wasteType}</span>
                                </div>
                              )}
                              {msg.formSuggestion.priority && (
                                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800">
                                  <span className="font-semibold w-16 flex-shrink-0">Priority:</span>
                                  <span className="bg-emerald-100 px-1.5 py-0.5 rounded capitalize">{msg.formSuggestion.priority}</span>
                                </div>
                              )}
                              {msg.formSuggestion.description && (
                                <div className="text-[11px] text-emerald-800 mt-1.5 line-clamp-2 italic opacity-80">
                                  "{msg.formSuggestion.description}"
                                </div>
                              )}
                            </div>
                            {filledForm ? (
                              <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Form filled — scroll up to review!
                              </div>
                            ) : (
                              <button
                                onClick={() => handleFillForm(msg.formSuggestion!)}
                                className="w-full flex items-center justify-center gap-1.5 py-2 gradient-brand text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                                Auto-Fill the Report Form
                              </button>
                            )}
                          </div>
                        )}

                        <span className="text-[9px] text-muted-foreground px-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Streaming */}
                  {streamingText && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="max-w-[78%]">
                        <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed bg-white border border-border shadow-sm">
                          {cleanStreamDisplay.split('\n').map((line, i, arr) => (
                            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                          ))}
                          <span className="inline-block w-0.5 h-3.5 bg-emerald-500 ml-0.5 animate-pulse align-middle" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Typing dots */}
                  {loading && !streamingText && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                        <div className="flex gap-1 items-center h-4">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* FAQ Chips — shown only on welcome state */}
                {messages.length === 1 && !loading && (
                  <div className="px-3 pb-2 pt-1 bg-white border-t border-border/60">
                    <p className="text-[10px] text-muted-foreground font-medium py-1">Quick questions:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {FAQ_CHIPS.map(chip => (
                        <button
                          key={chip.label}
                          onClick={() => sendMessage(chip.msg)}
                          className="px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium rounded-xl hover:bg-emerald-100 transition-colors"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="px-3 py-3 border-t border-border bg-white flex-shrink-0">
                  {showOnReportPage && onFillForm && (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 mb-1.5 font-medium">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      Describe your issue — I'll auto-fill the form above
                    </div>
                  )}
                  <div className="flex gap-2 items-end">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Describe the issue or ask a question…"
                      rows={1}
                      style={{ minHeight: '42px', maxHeight: '96px' }}
                      className="flex-1 resize-none px-3 py-2.5 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] outline-none bg-background overflow-y-auto"
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                      aria-label="Send"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                    Powered by OnSpace AI · Gemini 3 Flash
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
