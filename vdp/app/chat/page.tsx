// app/chat/page.tsx

"use client"; // Mark this as a client component

import { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages'; // Ensure path is correct
import socket from '../../lib/socket'; // Ensure socket.ts is correctly implemented

// Define the message type for better TypeScript handling
type Message = {
    id: number;
    text: string;
    user: string;
};

export default function ChatPage() {
    const [input, setInput] = useState<string>(''); // Explicit type annotation
    const [messages, setMessages] = useState<Message[]>([]); // Type for messages array

    useEffect(() => {
        // Fetch initial messages
        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/chat');
                if (!res.ok) throw new Error('Failed to fetch messages');
                
                const data: Message[] = await res.json();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        
        fetchMessages();

        // Listen for incoming messages via WebSocket
        socket.on('message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    // Handle message sending
    const sendMessage = async () => {
        if (!input.trim()) return;

        const message = { text: input, user: 'Anonymous' };
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message),
            });
            if (!res.ok) throw new Error('Failed to send message');

            setInput(''); // Clear input on success
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div>
            <ChatMessages messages={messages} /> {/* Ensure ChatMessages component is imported */}
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
