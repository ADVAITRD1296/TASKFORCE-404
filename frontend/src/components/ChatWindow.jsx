import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { apiSendChatMessage } from '../services/api';

const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'System', content: 'Welcome to Bookzy Support! How can we help you today?', type: 'CHAT' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isTyping]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            const userMsg = input;
            setMessages(prev => [...prev, { sender: 'You', content: userMsg, type: 'CHAT' }]);
            setInput('');
            setIsTyping(true);

            try {
                const res = await apiSendChatMessage(userMsg);
                setMessages(prev => [...prev, { sender: 'Support', content: res.reply, type: 'CHAT' }]);
            } catch (err) {
                setMessages(prev => [...prev, { sender: 'System', content: 'Sorry, I am having trouble connecting right now.', type: 'CHAT' }]);
            } finally {
                setIsTyping(false);
            }
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    background: 'linear-gradient(135deg, #0046FF, #0036cc)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '50%',
                    border: 'none',
                    boxShadow: '0 6px 20px rgba(0, 70, 255, 0.35)',
                    cursor: 'pointer',
                    zIndex: 9999,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                aria-label="Open chat support"
            >
                <MessageCircle size={28} />
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '360px',
            height: '480px',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            border: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0046FF, #0036cc)',
                padding: '18px 20px',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        background: '#4ade80',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                    }} />
                    <span style={{ fontWeight: 700, fontSize: '15px' }}>Live Support</span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: 'none',
                        padding: '6px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                    aria-label="Close chat"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: '#f8fafc'
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            maxWidth: '80%',
                            padding: '10px 14px',
                            borderRadius: msg.sender === 'You' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            fontSize: '13px',
                            lineHeight: '1.5',
                            ...(msg.sender === 'You'
                                ? { background: 'linear-gradient(135deg, #0046FF, #0036cc)', color: 'white' }
                                : { background: '#ffffff', color: '#334155', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                            )
                        }}>
                            <p style={{
                                fontWeight: 700,
                                fontSize: '10px',
                                opacity: 0.7,
                                margin: '0 0 4px 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>{msg.sender}</p>
                            <p style={{ margin: 0 }}>{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            background: '#ffffff',
                            color: '#64748b',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            borderRadius: '16px 16px 16px 4px',
                            padding: '12px 16px',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <span style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1s infinite' }}></span>
                            <span style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1s infinite 0.2s' }}></span>
                            <span style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1s infinite 0.4s' }}></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={{
                padding: '14px 16px',
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        fontSize: '13px',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        color: '#1e293b',
                        padding: '6px 0'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#0046FF',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    aria-label="Send message"
                >
                    <Send size={20} />
                </button>
            </form>

            {/* Animations via injected style tag */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
            `}</style>
        </div>
    );
};

export default ChatWindow;
