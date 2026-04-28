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
                className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
            >
                <MessageCircle size={28} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100">
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-semibold">Live Support</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            msg.sender === 'You' 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                        }`}>
                            <p className="font-bold text-[10px] opacity-70 mb-1">{msg.sender}</p>
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 shadow-sm rounded-2xl rounded-bl-none p-3 text-sm flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 text-sm border-none focus:ring-0 outline-none"
                />
                <button type="submit" className="text-primary hover:scale-110 transition-transform">
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
