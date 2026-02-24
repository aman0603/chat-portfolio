import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../context/ChatContext';

function MdContent({ text }: { text: string }) {
    return (
        <ReactMarkdown
            components={{
                p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 mb-1.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 mb-1.5">{children}</ol>,
                li: ({ children }) => <li className="text-sm leading-snug">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => (
                    <code className="font-mono text-xs bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">{children}</code>
                ),
                a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-accent transition-colors">
                        {children}
                    </a>
                ),
            }}
        >
            {text}
        </ReactMarkdown>
    );
}

const SUGGESTIONS = [
    "What are Aman's skills?",
    'Tell me about his projects',
    'What is his experience?',
];

export default function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { messages, isLoading, sendMessage } = useChat();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;
        sendMessage(trimmed);
        setInput('');
    };

    const handleSuggestion = (text: string) => {
        if (isLoading) return;
        sendMessage(text);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] flex flex-col shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-2xl overflow-hidden border border-surface-200/50 dark:border-surface-800/50"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-accent to-primary-600 px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-display font-bold text-sm backdrop-blur-sm">
                                A
                            </div>
                            <div>
                                <div className="text-white font-display font-semibold text-sm">
                                    Aman's AI Assistant
                                </div>
                                <div className="text-white/60 text-xs font-mono flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Online — Powered by RAG
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 p-4 space-y-3 overflow-y-auto bg-surface-50 dark:bg-surface-950 max-h-[350px] min-h-[250px]"
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-accent to-primary-600 text-white rounded-br-md'
                                        : 'bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 text-surface-900 dark:text-surface-200 rounded-bl-md'
                                        }`}
                                    style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                                >
                                    {msg.role === 'assistant'
                                        ? <MdContent text={msg.text} />
                                        : msg.text
                                    }
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                            <div className="flex justify-start">
                                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/50 flex gap-1.5">
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                    <div className="typing-dot" />
                                </div>
                            </div>
                        )}

                        {/* Suggestions when few messages */}
                        {messages.length <= 1 && (
                            <div className="space-y-2 pt-2">
                                <p className="text-xs font-mono text-surface-900/40 dark:text-surface-200/40">
                                    Try asking:
                                </p>
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleSuggestion(s)}
                                        className="block w-full text-left px-3 py-2 rounded-xl text-sm border border-surface-200/50 dark:border-surface-800/50 text-surface-900/70 dark:text-surface-200/70 hover:border-accent/40 hover:text-accent transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-3 bg-white dark:bg-surface-900 border-t border-surface-200/30 dark:border-surface-800/30 flex gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about Aman..."
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800/60 border border-surface-200/40 dark:border-surface-800/40 text-sm text-surface-900 dark:text-surface-200 placeholder:text-surface-900/30 dark:placeholder:text-surface-200/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="w-10 h-10 rounded-xl bg-gradient-to-r from-accent to-primary-600 text-white flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-accent/20 flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
