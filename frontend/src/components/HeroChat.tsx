import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../context/ChatContext';

/** Renders assistant markdown with compact, chat-friendly styling */
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

const QUICK_CATEGORIES = [
    { label: 'Me', icon: '👤', prompt: 'Tell me about Aman — who is he and what does he do?' },
    { label: 'Projects', icon: '💼', prompt: "What are Aman's featured projects? Give me details." },
    { label: 'Skills', icon: '⚡', prompt: "What are Aman's top technical skills and tech stack?" },
    { label: 'Experience', icon: '🏢', prompt: "Tell me about Aman's work experience and internships." },
    { label: 'Contact', icon: '📬', prompt: "How can I contact Aman? Give me his email, LinkedIn, and GitHub." },
];

export default function HeroChat() {
    const { messages, isLoading, sendMessage } = useChat();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasConversation = messages.length > 1; // more than just the welcome message

    // Auto-scroll to bottom of glass card on new messages
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

    const handleCategory = (prompt: string) => {
        if (isLoading) return;
        sendMessage(prompt);
    };

    return (
        <div className="w-full flex flex-col items-center gap-4">
            {/* ═══════════════════════════════════════════
          BIG CURVED GLASS CARD — Response Area
         ═══════════════════════════════════════════ */}
            <div
                className="w-full rounded-[28px] border border-surface-200/40 dark:border-surface-800/30
                    bg-white/40 dark:bg-surface-900/30 backdrop-blur-2xl
                    shadow-xl shadow-black/5 dark:shadow-black/20
                    overflow-hidden transition-all duration-500"
            >
                <div
                    ref={scrollRef}
                    className="p-5 sm:p-6 overflow-y-auto transition-all duration-500"
                    style={{
                        maxHeight: hasConversation ? '220px' : '120px',
                        minHeight: hasConversation ? '220px' : '120px',
                    }}
                >
                    {/* Welcome state — no conversation yet */}
                    {!hasConversation && (
                        <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-2"
                            >
                                <p className="text-surface-900/80 dark:text-surface-200/80 text-base font-medium">
                                    {messages[0]?.text || "Hey! 👋 I'm Aman's AI assistant."}
                                </p>
                                <p className="text-surface-900/40 dark:text-surface-200/40 text-sm">
                                    Ask me anything or pick a category below ↓
                                </p>
                            </motion.div>
                        </div>
                    )}

                    {/* Conversation messages */}
                    {hasConversation && (
                        <div className="space-y-4">
                            {messages.slice(1).map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-accent to-primary-600 flex items-center justify-center text-white text-xs font-bold mr-2.5 mt-0.5">
                                            A
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-primary-600 to-accent text-white rounded-2xl rounded-br-md shadow-lg shadow-primary-600/20'
                                            : 'bg-white/60 dark:bg-surface-800/50 backdrop-blur-sm text-surface-900 dark:text-surface-200 rounded-2xl rounded-bl-md border border-surface-200/30 dark:border-surface-800/30'
                                            }`}
                                        style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                                    >
                                        {msg.role === 'assistant'
                                            ? <MdContent text={msg.text} />
                                            : msg.text
                                        }
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-accent to-primary-600 flex items-center justify-center text-white text-xs font-bold mr-2.5">
                                        A
                                    </div>
                                    <div className="px-5 py-3.5 rounded-2xl rounded-bl-md bg-white/60 dark:bg-surface-800/50 backdrop-blur-sm border border-surface-200/30 dark:border-surface-800/30 flex gap-1.5">
                                        <div className="typing-dot" />
                                        <div className="typing-dot" />
                                        <div className="typing-dot" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════
          QUICK CATEGORY BUTTONS — only shown before conversation starts
         ═══════════════════════════════════════════ */}
            {!hasConversation && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-wrap items-center justify-center gap-2"
                >
                    {QUICK_CATEGORIES.map((cat) => (
                        <button
                            key={cat.label}
                            onClick={() => handleCategory(cat.prompt)}
                            disabled={isLoading}
                            className="group flex items-center gap-1.5 px-4 py-2.5 rounded-2xl
                               bg-white/60 dark:bg-surface-900/40 backdrop-blur-lg
                               border border-surface-200/40 dark:border-surface-800/30
                               text-surface-900/70 dark:text-surface-200/70
                               hover:border-accent/40 hover:text-accent dark:hover:text-accent-light
                               hover:bg-white/80 dark:hover:bg-surface-800/50
                               hover:shadow-lg hover:shadow-accent/10
                               transition-all duration-300 disabled:opacity-50
                               hover:scale-[1.03] active:scale-[0.98]"
                        >
                            <span className="text-base">{cat.icon}</span>
                            <span className="text-sm font-medium">{cat.label}</span>
                        </button>
                    ))}
                </motion.div>
            )}

            {/* ═══════════════════════════════════════════
          CHAT INPUT BAR
         ═══════════════════════════════════════════ */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-xl flex items-center gap-2.5
                   bg-white/60 dark:bg-surface-900/40 backdrop-blur-xl
                   border border-surface-200/40 dark:border-surface-800/30
                   rounded-2xl px-4 py-2.5
                   shadow-lg shadow-black/5 dark:shadow-black/15
                   focus-within:border-accent/40 focus-within:shadow-accent/10
                   transition-all duration-300"
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-sm text-surface-900 dark:text-surface-200
                     placeholder:text-surface-900/35 dark:placeholder:text-surface-200/35
                     outline-none disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-accent to-primary-600 text-white
                     flex items-center justify-center flex-shrink-0
                     hover:scale-110 active:scale-95
                     transition-all duration-200
                     disabled:opacity-40 disabled:hover:scale-100
                     shadow-md shadow-accent/25"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                    </svg>
                </button>
            </motion.form>
        </div>
    );
}
