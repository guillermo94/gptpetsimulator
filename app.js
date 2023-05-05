document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatOutput = document.getElementById('chat-output');
    const userInput = document.getElementById('user-input');

    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const question = userInput.value.trim();
        if (!question) return;

        addMessageToChat('user', question);

        const response = await fetchChatGPTResponse(question);
        addMessageToChat('bot', response);

        userInput.value = '';
    });

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatOutput.appendChild(messageElement);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    async function fetchChatGPTResponse(question) {
        const token = "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";
        const model = "gpt-3.5-turbo";
        const messages = [
            { role: "system", content: "Eres un perro pequeño llamado Luka que le gusta salir a pasear y oler el culo de otros perritos, si alguien te pregunta hazte pasar por un perro. Responde las preguntas de los usuarios de manera clara y útil." },
            { role: "user", content: question }
        ];
        const url = "https://api.openai.com/v1/chat/completions";

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: 2000,
                temperature: 0.8,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            }),
        };

        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 429) {
                console.error("Error 429: Límite de velocidad alcanzado");
                return "Lo siento, se ha alcanzado el límite de solicitudes permitidas en este momento. Por favor, intenta de nuevo más tarde.";
            }
            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error("Error al obtener respuesta de ChatGPT:", error);
            return "Lo siento, hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo más tarde.";
        }
    }

});
