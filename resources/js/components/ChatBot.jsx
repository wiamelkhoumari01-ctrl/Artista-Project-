import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import '../../css/chatbot.css';

const SUGGESTIONS = [
    "Qui sont vos artistes ?",
    "Quels sont les prochains événements ?",
    "Comment contacter ARTISTA ?",
];

export default function ChatBot({ navOpen = false }) {
    const [open, setOpen] = useState(false);

    // Ferme le chatbot quand le menu mobile s'ouvre
    useEffect(() => {
        if (navOpen) setOpen(false);
    }, [navOpen]);
    
    const [messages, setMessages] = useState([
        { from: 'bot', text: "Bonjour 👋 Je suis l'assistant ARTISTA. Comment puis-je vous aider ?" }
    ]);
    const [input,   setInput]   = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text) => {
        const msg = text || input.trim();
        if (!msg) return;

        setMessages(prev => [...prev, { from: 'user', text: msg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/api/chatbot', { message: msg });
            setMessages(prev => [...prev, { from: 'bot', text: res.data.reply }]);
        } catch {
            setMessages(prev => [...prev, { from: 'bot', text: "Erreur de connexion. Réessayez plus tard." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Bouton flottant */}
            <button className="chatbot-fab" onClick={() => setOpen(v => !v)}>
                {open ? '✕' : '🤖'}
            </button>

            {/* Fenêtre chat */}
            {open && (
                <div className="chatbot-window">

                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-left">
                            <img src="/images/logo_art.png" alt="logo" />
                            <div>
                                <div className="chatbot-header-name">Assistant ARTISTA</div>
                                <div className="chatbot-header-status">● En ligne</div>
                            </div>
                        </div>
                        <button className="chatbot-close-btn" onClick={() => setOpen(false)}>✕</button>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-body">
                        {messages.map((m, i) => (
                            <div key={i} className={`chatbot-message-row ${m.from}`}>
                                <div className={m.from === 'user' ? 'chatbot-bubble-user' : 'chatbot-bubble-bot'}>
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="chatbot-message-row bot">
                                <div className="chatbot-bubble-bot">
                                    <div className="chatbot-dots">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Suggestions */}
                    {messages.length <= 1 && (
                        <div className="chatbot-suggestions">
                            {SUGGESTIONS.map((s, i) => (
                                <button key={i} className="chatbot-sugg-btn" onClick={() => sendMessage(s)}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="chatbot-input-row">
                        <input
                            className="chatbot-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Votre message..."
                            disabled={loading}
                        />
                        <button
                            className="chatbot-send-btn"
                            onClick={() => sendMessage()}
                            disabled={loading}
                        >
                            ➤
                        </button>
                    </div>

                </div>
            )}
        </>
    );
}