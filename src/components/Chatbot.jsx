import React, { useState } from 'react';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';

function Chatbot() {
    const [messages, setMessages] = useState([]);

    const handleSend = async (userMessage) => {
        // Добавляем сообщение пользователя в состояние
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);

        const apiUrl = '/api/chat/completions';
        const apiKey = import.meta.env.VITE_API_KEY;

        console.log('[DEBUG] Отправка запроса к API:', apiUrl);
        console.log('[DEBUG] API ключ:', apiKey ? 'Присутствует' : 'Отсутствует');
        console.log('[DEBUG] Сообщение пользователя:', userMessage);

        // Формируем тело запроса с системным сообщением и сообщением пользователя
        const requestBody = {
            model: 'deepseek-ai/DeepSeek-R1',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. Answer in Russian'
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
        };

        console.log('[DEBUG] Тело запроса:', JSON.stringify(requestBody, null, 2));

        try {
            const response = await fetch('/api/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            console.log('[DEBUG] Код ответа:', response.status);
            console.log('[DEBUG] Заголовки ответа:', JSON.stringify([...response.headers]));

            if (!response.ok) {
                throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[DEBUG] Ответ API:', JSON.stringify(data, null, 2));

            if (!data.choices || data.choices.length === 0) {
                throw new Error('Пустой ответ от API.');
            }

            // Извлекаем контент и разбиваем его по разделителю '</think>\n\n'
            const fullText = data.choices[0].message.content;
            let processedText = fullText;
            if (fullText.includes('</think>\n\n')) {
                const parts = fullText.split('</think>\n\n');
                processedText = parts[1] || fullText;
            }

            const aiMessage = { role: 'assistant', content: processedText };
            setMessages([...newMessages, aiMessage]);
        } catch (error) {
            console.error('[ERROR] Ошибка при получении ответа от ИИ:', error);
            const errorMessage = { role: 'assistant', content: 'Произошла ошибка при получении ответа от ИИ.' };
            setMessages([...newMessages, errorMessage]);
        }
    };

    return (
        <div className="chatbot">
            <ChatMessages messages={messages} />
            <ChatInput onSend={handleSend} />
        </div>
    );
}

export default Chatbot;
