"use client"

import { useState } from "react";

interface MessagePanelProps {
    user: {
        username: string;
        messages: { content: string; fromSelf: boolean }[];
    };
    onSendMessage: (message: string) => void;
}


export default function MessagePanel({ user, onSendMessage }: MessagePanelProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        onSendMessage(input);
        setInput("");

    }

    return (
        <div className="flex-1 p-4">
            <h2 className="text-xl font-bold mb-2">{user.username}</h2>
            <ul className="mb-4">
                {user.messages.map((message, index) => (
                    <li key={index} className={`p-2 ${message.fromSelf ? "text-right text-blue-500" : "text-left text-gray-700"}`}>{message.content}</li>
                ))}
            </ul>
            <form className="flex" onSubmit={handleSubmit}>
                <textarea value={input} className="flex-1 border rounded p-2" onChange={(e) => setInput(e.target.value)} />
                <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">Send</button>

            </form>

        </div >
    )

}