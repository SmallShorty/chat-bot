import React, { useState } from 'react';

function ChatInput({ onSend }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        onSend(message);
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="chat-input-form">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="chat-input"
            />
            <button type="submit" className="send-button">Отправить</button>
        </form>
    );
}

export default ChatInput;
