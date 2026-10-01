// Interacciones de la página de ayuda.
document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.querySelector('.chat-send-btn');
    const input = document.querySelector('.chat-input-wrapper input');
    const chat = document.querySelector('.comunidad-card');
    const inputWrapper = document.querySelector('.chat-input-wrapper');

    if (!sendButton || !input || !chat || !inputWrapper) return;

    const sendMessage = () => {
        const message = input.value.trim();
        if (!message) return;

        const row = document.createElement('div');
        row.className = 'chat-mensaje';
        const avatar = document.createElement('div');
        avatar.className = 'chat-avatar';
        avatar.setAttribute('aria-hidden', 'true');
        const icon = document.createElement('i');
        icon.className = 'fas fa-user';
        avatar.append(icon);

        const content = document.createElement('div');
        content.className = 'chat-contenido';
        const user = document.createElement('span');
        user.className = 'chat-usuario';
        user.textContent = 'Tú';
        const text = document.createElement('p');
        text.className = 'chat-texto';
        text.textContent = message;
        content.append(user, text);
        row.append(avatar, content);
        chat.insertBefore(row, inputWrapper);

        input.value = '';
        chat.scrollTop = chat.scrollHeight;
        input.focus();
    };

    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
});
