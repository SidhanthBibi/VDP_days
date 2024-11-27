// app/chat/page.tsx
"use client"; // Ensure client component

import { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages';
import socket from '../../lib/socket';

type Message = {
    id: number;
    text: string;
    user: string;
};

export default function ChatPage() {
    const [input, setInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // Listen for initial messages
        socket.on('loadMessages', (loadedMessages: Message[]) => {
            setMessages(loadedMessages);
        });

        // Listen for new messages
        socket.on('receiveMessage', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clear messages on page unload
        return () => {
            socket.off('loadMessages');
            socket.off('receiveMessage');
            setMessages([]); // Clear messages on unmount
        };
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;

        const message = { id: Date.now(), text: input, user: 'Anonymous' };
        socket.emit('sendMessage', message); // Send message to server
        setInput(''); // Clear input field
    };

    return (
        <div>
            <ChatMessages messages={messages} />
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
