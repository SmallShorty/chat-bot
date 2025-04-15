import React from 'react';

function ChatMessages({ messages }) {
    return (
        <div className="chat-messages">
            {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                    <span className="message-content">{msg.content}</span>
                </div>
            ))}
        </div>
    );
}

export default ChatMessages;
