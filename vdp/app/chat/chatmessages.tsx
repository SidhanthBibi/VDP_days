// app/chat/ChatMessages.tsx
import React from 'react';

type Message = {
    id: number;
    text: string;
    user: string;
};

export default function ChatMessages({ messages }: { messages: Message[] }) {
    return (
        <div>
            {messages.map((msg) => (
                <div key={msg.id}>
                    <strong>{msg.user}:</strong> {msg.text}
                </div>
            ))}
        </div>
    );
}
