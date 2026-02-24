import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '') + '/api';
console.log('Using API Base:', API_BASE);

interface Message {
    role: 'user' | 'assistant';
    text: string;
}

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    sendMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
    messages: [],
    isLoading: false,
    sendMessage: async () => { },
});

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            text: "Hey! 👋 I'm Aman's AI assistant. Ask me anything about his skills, projects, experience, or background!",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const sessionRef = useRef(`session-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    const loadingRef = useRef(false);

    const sendMessage = useCallback(async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);

        try {
            const response = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionRef.current, message: trimmed }),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error('No reader available');

            let assistantText = '';
            setMessages((prev) => [...prev, { role: 'assistant', text: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (!line.startsWith('data:')) continue;

                    // Remove the "data:" prefix and the single SSE protocol space.
                    // Strip trailing \r because sse_starlette sends CRLF (\r\n) line endings;
                    // splitting by \n leaves a \r which HTML renders as whitespace → "a m a n".
                    let data = line.slice(5); // remove "data:"
                    if (data.startsWith(' ')) data = data.slice(1); // remove SSE space
                    if (data.endsWith('\r')) data = data.slice(0, -1); // strip CRLF carriage return

                    if (data === '[DONE]') break;
                    if (!data) continue;

                    assistantText += data;
                    setMessages((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1] = { role: 'assistant', text: assistantText };
                        return updated;
                    });
                }
            }
        } catch (err) {
            console.error('Chat error:', err);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: "Sorry, I couldn't connect to the server right now. Make sure the backend is running on port 8000.",
                },
            ]);
        } finally {
            loadingRef.current = false;
            setIsLoading(false);
        }
    }, []);

    return (
        <ChatContext.Provider value={{ messages, isLoading, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);
