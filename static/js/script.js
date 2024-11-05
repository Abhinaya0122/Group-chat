document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    const inputField = document.getElementById('input');
    const messagesContainer = document.getElementById('messages');
    const sendButton = document.getElementById('send-button');
    
    // Generate a mock username for each user (for demonstration)
    const username = prompt("Enter your username:") || "Anonymous";

    // Send message when clicking the send button
    sendButton.addEventListener('click', () => {
        sendMessage();
    });

    // Send message on pressing Enter
    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Function to send a message
    function sendMessage() {
        const message = inputField.value;
        if (message.trim()) {
            socket.emit('message', {user: username, text: message});
            inputField.value = '';
            addMessage(username, message, true);
        }
    }

    // Display message in the chat
    function addMessage(user, text, isCurrentUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isCurrentUser ? 'me' : 'other');
        messageDiv.innerHTML = `<strong>${user}:</strong> ${text}`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Receive messages from other users
    socket.on('response', (data) => {
        if (data.user !== username) {
            addMessage(data.user, data.text, false);
        }
    });
});
